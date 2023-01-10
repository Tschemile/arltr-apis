import { ApiProperty } from "@nestjs/swagger";
import { USER_ROLE } from "apps/profiles/constants";
import { BaseQueryInput } from "base";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class QueryJobInput extends BaseQueryInput {
  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  jobIds?: string[];

  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  categoryIds?: string[];

  @IsString()
  search?: string

  @IsEnum(USER_ROLE)
  type?: string
}