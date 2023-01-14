import { ApiProperty } from "@nestjs/swagger";
import { BaseQueryInput } from "base";
import { IsOptional, IsString } from "class-validator";

export class QueryCourseInput extends BaseQueryInput {
  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  authors?: string[];

  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  categorys?: string[];

  @IsString()
  search?: string
 
}