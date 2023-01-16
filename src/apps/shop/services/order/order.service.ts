import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddressService } from "apps/address";
import { UserToken } from "apps/auth";
import { ProfileService } from "apps/profiles";
import { CreateOrderInput, QUERY_ROLE, UpdateOrderInput } from "apps/shop/dtos";
import { Order } from "apps/shop/entities";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";
import { TableName } from "utils";
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
    super(orderRepo, orderRelations)
  }

  async checkValidInsert(input: CreateOrderInput) {
    const { shop: shopId, address: addressId, orderItems = [] } = input

    const shop = await this.profileService.findOne({ id: shopId })
    if (!shop) {
      BaseError(TableName.PROFILE, HttpStatus.NOT_FOUND)
    }

    const address = await this.addressService.findOne({ id: addressId })
    if (!address) {
      BaseError(TableName.ADDRESS, HttpStatus.NOT_FOUND)
    }

    const productIds = orderItems.map((x) => x.product)
    const { products, total = 0 } = await this.productService.findAll(productIds)

    if (total !== orderItems.length) {
      BaseError(TableName.PRODUCT, HttpStatus.NOT_FOUND)
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
      shop,
      address,
      orderItems: newOrderItems,
    }
  }

  async create(user: UserToken, input: CreateOrderInput) {
    const { orderItems, address, shop } = await this.checkValidInsert(input)

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

    const { data: orders, total } = await this.find({ where })

    return {
      orders,
      total,
    }
  }

  async findById(user: UserToken, id: string) {
    const order = await this.findOne({ id })
    if (!order) {
      BaseError(TableName.ORDER, HttpStatus.NOT_FOUND)
    } else if (
      order.shop.id !== user.profile.id
      || order.user.id !== user.profile.id
    ) {
      BaseError(TableName.ORDER, HttpStatus.FORBIDDEN)
    }

    return { order }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateOrderInput
  ) {
    const order = await this.findOne({ id })
    if (!order) {
      BaseError(TableName.ORDER, HttpStatus.NOT_FOUND)
    } else if (order.shop.id !== user.profile.id) {
      BaseError(TableName.ORDER, HttpStatus.FORBIDDEN)
    }

    await this.orderRepo.save({
      ...input,
      id,
    })

    const updatedOrder = {
      ...order,
      ...input,
    }

    return { order: updatedOrder }
  }

  async remove(
    user: UserToken,
    id: string,
  ) {

    const order = await this.findOne({ id })
    if (!order) {
      BaseError(TableName.ORDER, HttpStatus.NOT_FOUND)
    } else if (order.shop.id !== user.profile.id) {
      BaseError(TableName.ORDER, HttpStatus.FORBIDDEN)
    }

    return {
      order: await this.orderRepo.softRemove(order)
    }
  }
}