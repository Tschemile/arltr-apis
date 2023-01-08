import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDateString, IsUrl } from "class-validator"

export class UpdateOrderInput {
  @IsBoolean()
  @ApiProperty({ type: Boolean, default: false })
  isPaid?: boolean

  @IsDateString()
  @ApiProperty({ type: String, format: 'date-time' })
  paidAt?: Date

  @IsBoolean()
  @ApiProperty({ type: Boolean, default: false })
  isDelivered?: boolean

  @IsDateString()
  @ApiProperty({ type: String, format: 'date-time' })
  deliveredAt?: Date

  @IsUrl()
  @ApiProperty({ type: String })
  receipt?: string
}