import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class BaseQueryInput {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number })
  limit?: number
}

export class BaseOutputResponse {
  @IsNumber()
  @ApiProperty({ type: Number })
  status: number

  @IsString()
  @ApiProperty({ type: String })
  message?: string

  @IsNumber()
  @ApiProperty({ type: Number })
  total?: number
}