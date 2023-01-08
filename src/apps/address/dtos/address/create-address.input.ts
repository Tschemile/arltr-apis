import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateAddressInput {
  @IsString()
  @ApiProperty({ type: String })
  address: string

  @IsString()
  @ApiProperty({ type: String })
  city: string

  @IsString()
  @ApiProperty({ type: String })
  state: string

  @IsString()
  @ApiProperty({ type: String })
  country: string

  @IsNumber()
  @ApiProperty({ type: Number })
  lat: number

  @IsNumber()
  @ApiProperty({ type: Number })
  long: number
}
