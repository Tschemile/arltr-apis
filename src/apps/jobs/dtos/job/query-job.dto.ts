import { ApiProperty } from "@nestjs/swagger";
import { JOB_TYPE } from "apps/jobs/constants";
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

  @IsEnum(JOB_TYPE)
  type?: string
}