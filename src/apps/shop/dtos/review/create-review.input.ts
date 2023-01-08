import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUUID } from "class-validator";

export class CreateReviewInput {
  @IsUUID()
  @ApiProperty({ type: String })
  product: string

  @IsNumber()
  @ApiProperty({ type: Number })
  rating: number

  @IsString()
  @ApiProperty({ type: String })
  comment: string
}