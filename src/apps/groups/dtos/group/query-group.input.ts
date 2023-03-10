import { GROUP_MODE, QUERY_GROUP_TYPE,  } from "apps/groups/constants";
import { BaseQueryInput } from "base";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class QueryGroupInput extends BaseQueryInput {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  search?: string

  @IsEnum(QUERY_GROUP_TYPE)
  @IsNotEmpty()
  type: string

  @IsEnum(GROUP_MODE)
  @IsOptional()
  @IsNotEmpty()
  mode?: string

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  user?: string
}