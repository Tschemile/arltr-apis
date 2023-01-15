import { ApiProperty } from "@nestjs/swagger";
import { BaseQueryInput } from "base";
import { IsOptional, IsString } from "class-validator";

export class QueryCertificateInput extends BaseQueryInput {
  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  courses: string[];

  @IsString()
  search?: string
}