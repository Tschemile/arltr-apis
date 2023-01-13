import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddressService } from "apps/address";
import { UserToken } from "apps/auth";
import { ProfileService } from "apps/profiles";
import { CreateOrderInput, QUERY_ROLE, UpdateOrderInput } from "apps/shop/dtos";
import { Order } from "apps/shop/entities";
import { BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
import { ProductService } from "../product";
import { ItemService } from "./item";

export const orderRelations = {
  address: true,
  shop: true,
  user: true,
}

@Injectable()
export class OrderService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
    @Inject(forwardRef(() => AddressService)) private addressService: AddressService,
    private productService: ProductService,
    private itemService: ItemService,
  ) { 
    super(orderRepo)
  }

  async checkValidInsert(input: CreateOrderInput) {
    const { shop: shopId, address: addressId, orderItems = [] } = input

    const shop = await this.profileService.findOne({ id: shopId })
    const address = await this.addressService.findOne({ id: addressId })

    const productIds = orderItems.map((x) => x.product)
    const { products, total = 0 } = await this.productService.findAll(productIds)

    if (!shop || !address || total !== orderItems.length) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    }

    const newOrderItems = []

    for (const item of orderItems) {
      const product = products.find((x) => x.id === item.product)
      newOrderItems.push({
        ...item,
        product,
      })
    }

    return {
      status: HTTP_STATUS.OK,
      shop,
      address,
      orderItems: newOrderItems,
    }
  }

  async create(user: UserToken, input: CreateOrderInput) {
    const { status, orderItems, address, shop } = await this.checkValidInsert(input)

    if (status === HTTP_STATUS.Not_Found) {
      return { status }
    }

    const createdOrder = this.orderRepo.create({
      ...input,
      shop,
      address,
      user: user.profile,
      ticketId: `${new Date().getTime()}`,
    })

    await this.orderRepo.save(createdOrder)

    const itemsInput = []
    for (const item of orderItems) {
      itemsInput.push({
        ...item,
        order: createdOrder,
      })
    }

    const createdItems = await this.itemService.insertMany(itemsInput)

    return {
      status: HTTP_STATUS.Created,
      order: {
        ...createdOrder,
        orderItems: createdItems,
      }
    }
  }

  async findAll(user: UserToken, role: QUERY_ROLE) {
    const where: FindOptionsWhere<Order> = {}

    switch (role) {
      case 'User': {
        where.user = {
          id: user.profile.id
        }
        break
      }
      case 'Shop': {
        where.shop = {
          id: user.profile.id
        }
        break
      }
      default: {
        where.id = ''
      }
    }

    const [orders, total] = await Promise.all([
      this.orderRepo.find({ relations: orderRelations, where }),
      this.orderRepo.count({ where })
    ])

    return {
      orders,
      total,
    }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateOrderInput
  ) {
    const order = await this.findOne({ id }, orderRelations)
    if (!order) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    } else if (user.profile.id !== order.shop.id) {
      return {
        status: HTTP_STATUS.Forbidden
      }
    }

    await this.orderRepo.save({
      ...input,
      id,
    })

    const updatedOrder = {
      ...order,
      ...input,
    }

    return {
      status: HTTP_STATUS.OK,
      order: updatedOrder,
    }
  }

  async remove(
    user: UserToken,
    id: string,
  ) {
    const order = await this.findOne({ id }, orderRelations)
    if (!order) {
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }

    if (order.shop.id !== user.profile.id) {
      return {
        status: HTTP_STATUS.Forbidden
      }
    }

    await this.orderRepo.softRemove(order)

    return {
      status: HTTP_STATUS.OK,
    }
  }
}