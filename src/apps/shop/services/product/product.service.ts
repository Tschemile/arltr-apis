import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddressService } from "apps/address";
import { UserToken } from "apps/auth";
import { CategoryService } from "apps/settings";
import { CreateProductInput, CreateReviewInput, UpdateProductInput } from "apps/shop/dtos";
import { Product } from "apps/shop/entities";
import { BaseService } from "base";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { generateSlug, HTTP_STATUS } from "utils";

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
    super(productRepo)
  }

  async checkValidUpsert({ categoryId, addressId }: {
    categoryId: string,
    addressId: string,
  }) {
    const category = await this.categoryService.findOne({ id: categoryId })
    const address = await this.addressService.findOne({ id: addressId })

    if (!category || !address) {
      return {
        status: HTTP_STATUS.Bad_Request
      }
    }

    return {
      status: HTTP_STATUS.OK,
      category,
      address,
    }
  }

  async create(user: UserToken, input: CreateProductInput) {
    const { name, category: categoryId, address: addressId } = input
    
    const { status, category, address } = await this.checkValidUpsert({
      categoryId,
      addressId,
    })

    if (status === HTTP_STATUS.Bad_Request) {
      return { status }
    }

    const createdProduct = this.productRepo.create({
      ...input,
      slug: generateSlug(name),
      category,
      address,
      shop: user.profile,
    })
    await this.productRepo.save(createdProduct)

    return {
      status: HTTP_STATUS.Created,
      product: createdProduct,
    }
  }

  async findAll(ids?: string[]) {
    const where: FindOptionsWhere<Product> = {}

    if (ids && ids.length > 0) {
      where.id = In(ids)
    }

    const { data: products, total } = await this.find({
      where,
      relations: productRelations,
    })

    return { products, total }
  }

  async update(
    user: UserToken,
    id: string,
    input: UpdateProductInput,
  ) {
    const { name, category: categoryId, address: addressId } = input

    const { status: statusFound, data: product } = await this.validUpsert(
      { id },
      { shop: { id: user.profile.id }},
      productRelations,
    )
    if (statusFound !== HTTP_STATUS.OK) {
      return { statusFound }
    }

    const { status, category, address } = await this.checkValidUpsert({
      categoryId,
      addressId,
    })

    if (status === HTTP_STATUS.Bad_Request) {
      return { status }
    }

    await this.productRepo.save({
      ...input,
      category,
      address,
      slug: generateSlug(name),
      id,
    })

    const updatedProduct = { 
      ...product, 
      ...input, 
      slug: generateSlug(name), 
      category, 
      address 
    }

    return {
      status: HTTP_STATUS.OK,
      product: updatedProduct,
    }
  }

  async remove(
    user: UserToken,
    id: string,
  ) {
    const { status, data: product } = await this.validUpsert(
      { id },
      { shop: { id: user.profile.id }},
      productRelations,
    )
    if (status !== HTTP_STATUS.OK) {
      return { status }
    }

    await this.productRepo.softRemove(product)

    return {
      status: HTTP_STATUS.OK,
    }
  }

  async incrementReview(id: string, rating: number, numReview: number) {
    await this.productRepo.save({
      rating,
      numReview,
      id,
    })
  }
}