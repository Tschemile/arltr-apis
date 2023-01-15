import { BaseQueryInput } from "base";
import { IsString } from "class-validator";

export class QueryResumeInput extends BaseQueryInput {
  @IsString()
  search?: string
}