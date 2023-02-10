import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddressService } from "apps/address";
import { UserToken } from "apps/auth";
import { CategoryService } from "apps/settings";
import { CreateProductInput, UpdateProductInput } from "apps/shop/dtos";
import { Product } from "apps/shop/entities";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { generateSlug, ModuleName } from "utils";

export const productRelations = {
  shop: true,
  category: true,
  address: true,
}

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @Inject(forwardRef(() => CategoryService)) private categoryService: CategoryService,
    @Inject(forwardRef(() => AddressService)) private addressService: AddressService,
  ) {
    super(productRepo, productRelations)
  }

  async checkValidUpsert({ categoryId, addressId }: {
    categoryId: string,
    addressId: string,
  }) {
    const category = await this.categoryService.findOne({ id: categoryId })
    const address = await this.addressService.findOne({ id: addressId })

    if (!category) {
      BaseError(ModuleName.CATEGORY, HttpStatus.NOT_FOUND)
    }

    if (!address) {
      BaseError(ModuleName.ADDRESS, HttpStatus.NOT_FOUND)
    }

    return {
      category,
      address,
    }
  }

  async create(user: UserToken, input: CreateProductInput) {
    const { name, category: categoryId, address: addressId } = input

    const { category, address } = await this.checkValidUpsert({
      categoryId,
      addressId,
    })

    const createdProduct = this.productRepo.create({
      ...input,
      slug: generateSlug(name),
      category,
      address,
      shop: user.profile,
    })
    await this.productRepo.save(createdProduct)

    return { product: createdProduct }
  }

  async findAll(ids?: string[]) {
    const where: FindOptionsWhere<Product> = {}

    if (ids && ids.length > 0) {
      where.id = In(ids)
    }

    const { data: products, total } = await this.find({ where })

    return { products, total }
  }

  async findById(id: string) {
    const product = await this.findOne({ id })
    return { product }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateProductInput,
  ) {
    const { name, category: categoryId, address: addressId } = input

    const product = await this.findOne({ id })
    if (!product) {
      BaseError(ModuleName.PRODUCT, HttpStatus.NOT_FOUND)
    } else if (product.shop.id !== user.profile.id) {
      BaseError(ModuleName.PRODUCT, HttpStatus.FORBIDDEN)
    }

    const { category, address } = await this.checkValidUpsert({
      categoryId,
      addressId,
    })

    const updatedProduct = {
      ...input,
      slug: generateSlug(name),
      category,
      address
    }

    await this.productRepo.save({
      ...updatedProduct,
      id,
    })

    return {
      product: {
        ...product,
        ...updatedProduct,
      }
    }
  }

  async remove(
    user: UserToken,
    id: string,
  ) {
    const product = await this.findOne({ id })
    if (!product) {
      BaseError(ModuleName.PRODUCT, HttpStatus.NOT_FOUND)
    } else if (product.shop.id !== user.profile.id) {
      BaseError(ModuleName.PRODUCT, HttpStatus.FORBIDDEN)
    }

    return {
      product: await this.productRepo.softRemove(product)
    }
  }
}