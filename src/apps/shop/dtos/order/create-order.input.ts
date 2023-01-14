import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsUUID } from "class-validator";

export class OrderItems {
  @IsUUID()
  @ApiProperty({ type: String })
  product: string

  @IsNumber()
  @ApiProperty({ type: Number })
  quantity: number

  @IsNumber()
  @ApiProperty({ type: Number })
  price: number
}

export class CreateOrderInput {
  @IsUUID()
  @ApiProperty({ type: String })
  shop: string

  @IsUUID()
  @ApiProperty({ type: String })
  address: string

  @IsArray()
  @ApiProperty({ type: () => OrderItems })
  orderItems: OrderItems[]

  @IsNumber()
  @ApiProperty({ type: Number })
  taxPrice: number

  @IsNumber()
  @ApiProperty({ type: Number })
  shippingPrice: number

  @IsNumber()
  @ApiProperty({ type: Number })
  totalPrice: number
}