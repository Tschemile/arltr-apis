import { Body, Controller, Get, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateReviewInput } from "apps/shop/dtos";
import { GetReviewOutput, GetReviewsOutput } from "apps/shop/dtos/review/get-review.output";
import { ReviewService } from "apps/shop/services";
import { HTTP_STATUS } from "utils";

const MODULE_NAME = 'Review'

@ApiTags(MODULE_NAME)
@Controller(MODULE_NAME.toLowerCase())
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GetReviewOutput })
  async post(
    @Request() req,
    @Body() input: CreateReviewInput
  ): Promise<GetReviewOutput> {
    const { status, review } = await this.reviewService.create(req.user, input)

    if (status === HTTP_STATUS.Not_Found) {
      return {
        status,
        message: 'Invalid request'
      }
    }

    return {
      status,
      review,
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: GetReviewsOutput })
  async getById(
    @Query('product') product: string,
  ): Promise<GetReviewsOutput> {
    const { reviews, total } = await this.reviewService.findAll(product)

    return {
      status: HTTP_STATUS.OK,
      reviews,
      total,
    }
  }
}