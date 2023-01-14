import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Review } from "apps/shop/entities";
import { BaseOutputResponse } from "base";

export class GetReviewsOutput extends BaseOutputResponse {
  @ApiProperty({ type: () => [Review] })
  reviews: Review[]
}

export class GetReviewOutput extends OmitType(BaseOutputResponse, ['total'] as const) {
  @ApiProperty({ type: () => Review })
  review?: Review
}