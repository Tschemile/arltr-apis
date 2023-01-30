import { REACT_TYPE } from "apps/posts/constants";
import { BaseQueryInput } from "base";
import { IsEnum, IsOptional, IsUUID } from "class-validator";

export class QueryReactInput extends BaseQueryInput {
  @IsUUID()
  @IsOptional()
  post?: string

  @IsUUID()
  @IsOptional()
  comment?: string

  @IsEnum(REACT_TYPE)
  @IsOptional()
  type?: string
}