import { Body, Controller, Get, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateReviewInput } from "apps/shop/dtos";
import { GetReviewOutput, GetReviewsOutput } from "apps/shop/dtos/review/get-review.output";
import { ReviewService } from "apps/shop/services";
import { TableName } from "utils";

@ApiTags(TableName.REVIEW)
@Controller(TableName.REVIEW.toLowerCase())
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService
  ) { }

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GetReviewOutput })
  async post(
    @Request() req,
    @Body() input: CreateReviewInput
  ): Promise<GetReviewOutput> {
    return await this.reviewService.create(req.user, input)
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: GetReviewsOutput })
  async getById(
    @Query('product') product: string,
  ): Promise<GetReviewsOutput> {
    return await this.reviewService.findAll(product)
  }
}