import { ApiProperty } from "@nestjs/swagger";
import { PRODUCT_STATUS } from "apps/shop/constants";
import { IsArray, IsEnum, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateProductInput {
  @IsString()
  @ApiProperty({ type: String })
  name: string

  @IsUUID()
  @ApiProperty({ type: String })
  address: string

  @IsNumber()
  @ApiProperty({ type: Number })
  price: number

  @IsArray()
  @ApiProperty({ type: [String] })
  images: string[]

  @IsUUID()
  @ApiProperty({ type: String })
  category: string

  @IsString()
  @ApiProperty({ type: String })
  description: string

  @IsArray()
  @ApiProperty({ type: [String] })
  tags: string[]

  @IsEnum(PRODUCT_STATUS)
  @ApiProperty({ type: String, enum: PRODUCT_STATUS })
  status: string
}