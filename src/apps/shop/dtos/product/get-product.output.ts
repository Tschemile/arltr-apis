import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Product } from "apps/shop/entities";
import { BaseOutputResponse } from "base";

export class GetProductsOutput extends BaseOutputResponse {
  @ApiProperty({ type: () => [Product] })
  products: Product[]
}

export class GetProductOutput extends OmitType(BaseOutputResponse, ['total'] as const) {
  @ApiProperty({ type: () => Product })
  product?: Product
}