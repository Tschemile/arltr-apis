import { QUERY_TYPE } from "apps/groups/constants";
import { BaseQueryInput } from "base";
import { IsEnum, IsString } from "class-validator";

export class QueryGroupInput extends BaseQueryInput {
  @IsString()
  search?: string

  @IsEnum(QUERY_TYPE)
  type: string
}