import { ApiProperty } from "@nestjs/swagger";
import { BaseQueryInput } from "base";
import { IsOptional, IsString } from "class-validator";

export class QueryEventInput extends BaseQueryInput {
  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  groupIds?: string[];

  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  addressIds?: string[];

  @IsString()
  search?: string

}