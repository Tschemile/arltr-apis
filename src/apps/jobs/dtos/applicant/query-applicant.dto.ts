import { ApiProperty } from "@nestjs/swagger";
import { BaseQueryInput } from "base";
import { IsOptional, IsString } from "class-validator";

export class QueryApplicantInput extends BaseQueryInput {
  @IsString()
  search?: string

  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  jobs?: string[];

  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  resumes?: string[];

}