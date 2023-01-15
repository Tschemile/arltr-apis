import { ApiProperty } from "@nestjs/swagger";
import { Review } from "apps/shop/entities";

export class GetReviewsOutput {
  @ApiProperty({ type: () => [Review] })
  reviews: Review[]
}

export class GetReviewOutput {
  @ApiProperty({ type: () => Review })
  review?: Review
}