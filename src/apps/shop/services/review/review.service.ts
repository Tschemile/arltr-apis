import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { CreateReviewInput } from "apps/shop/dtos";
import { Review } from "apps/shop/entities";
import { BaseError, BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";
import { TableName } from "utils";
import { ProductService } from "../product";

export const reviewRelations = {
  user: true,
  product: true,
}

@Injectable()
export class ReviewService extends BaseService<Review> {
  constructor(
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    private productService: ProductService,
  ) { 
    super(reviewRepo)
  }

  async create(user: UserToken, input: CreateReviewInput) {
    const { product: productId, rating } = input

    const product = await this.productService.findOne({ id: productId })
    if (!product) {
      BaseError(TableName.PRODUCT, HttpStatus.NOT_FOUND)
    }

    const createdReview = this.reviewRepo.create({
      ...input,
      user: user.profile,
      product,
    })
    await this.reviewRepo.save(createdReview)

    const distance = product.rating - ((rating + product.rating) / (product.numReviews + 1))

    await this.productService.changeProperty({ id: product.id }, 'numReviews', 1, 'INCREMENT')
    await this.productService.changeProperty(
      { id: product.id },
      'rating',
      Math.abs(distance),
      distance > 0 ? 'INCREMENT' : 'DECREMENT',
    )

    return { review: createdReview, }
  }

  async findAll(product: string) {
    const where: FindOptionsWhere<Review> = {
      product: {
        id: product,
      }
    }

    const { data: reviews, total } = await this.find({
      where,
      relations: reviewRelations,
    })

    return { reviews, total }
  }
}