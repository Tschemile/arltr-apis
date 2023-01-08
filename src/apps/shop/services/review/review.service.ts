import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "apps/auth";
import { CreateReviewInput } from "apps/shop/dtos";
import { Review } from "apps/shop/entities";
import { BaseService } from "base";
import { FindOptionsWhere, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
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
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }

    const createdReview = this.reviewRepo.create({
      ...input,
      user: user.profile,
      product,
    })
    await this.reviewRepo.save(createdReview)

    const newNumReviews = product.numReviews + 1
    const newRating = (rating + product.rating) / newNumReviews
    await this.productService.incrementReview(
      product.id,
      newRating,
      newNumReviews,
    )

    return {
      status: HTTP_STATUS.Created,
      review: createdReview,
    }
  }

  async findAll(product: string) {
    const where: FindOptionsWhere<Review> = {
      product: {
        id: product,
      }
    }

    const [reviews, total] = await Promise.all([
      this.reviewRepo.find({ relations: reviewRelations, where }),
      this.reviewRepo.count({ where })
    ])

    return { reviews, total }
  }
}