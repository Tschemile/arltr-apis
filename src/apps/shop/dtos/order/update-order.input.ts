import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDateString, IsOptional, IsUrl } from "class-validator"

export class UpdateOrderInput {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: Boolean, default: false })
  isPaid?: boolean

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: String, format: 'date-time' })
  paidAt?: Date

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: Boolean, default: false })
  isDelivered?: boolean

  @IsDateString()
  @IsOptional()
  @ApiProperty({ type: String, format: 'date-time' })
  deliveredAt?: Date

  @IsUrl()
  @IsOptional()
  @ApiProperty({ type: String })
  receipt?: string
}