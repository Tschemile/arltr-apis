import { Body, Controller, Get, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "apps/auth";
import { CreateReviewInput } from "apps/shop/dtos";
import { GetReviewOutput, GetReviewsOutput } from "apps/shop/dtos/review/get-review.output";
import { ReviewService } from "apps/shop/services";

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
    return await this.reviewService.create(req.user, input)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: GetReviewsOutput })
  async getById(
    @Query('product') product: string,
  ): Promise<GetReviewsOutput> {
    return await this.reviewService.findAll(product)
  }
}