import { ApiProperty } from "@nestjs/swagger";
import { RESPONDED_TYPE } from "apps/address/constants";
import { BaseQueryInput } from "base";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class QueryRespondedInput extends BaseQueryInput {
  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  users?: string[];

  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  events?: string[];

  @IsString()
  search?: string

  @IsEnum(RESPONDED_TYPE)
  type?: string
}