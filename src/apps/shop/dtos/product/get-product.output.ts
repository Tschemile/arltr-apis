import { ApiProperty } from "@nestjs/swagger";
import { Product } from "apps/shop/entities";

export class GetProductsOutput {
  @ApiProperty({ type: () => [Product] })
  products: Product[]
}

export class GetProductOutput {
  @ApiProperty({ type: () => Product })
  product?: Product
}