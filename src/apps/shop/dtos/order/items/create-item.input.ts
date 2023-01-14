import { ApiProperty } from "@nestjs/swagger"
import { Product, Order } from "apps/shop/entities"
import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateItemInput {
  @IsNotEmpty()
  @ApiProperty({ type: () => Order })
  order: Order

  @IsNotEmpty()
  @ApiProperty({ type: () => Product })
  product: Product

  @IsNumber()
  @ApiProperty({ type: Number })
  quantity: number

  @IsNumber()
  @ApiProperty({ type: Number })
  price: number
}