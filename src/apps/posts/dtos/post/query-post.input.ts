import { POST_TYPE } from "apps/posts/constants";
import { BaseQueryInput } from "base";
import { IsBoolean, IsEnum, IsString, IsUUID } from "class-validator";

export type QUERY_TYPE = 'COMMUNITY' | 'GROUP' | 'USER'

export class QueryPostInput extends BaseQueryInput {
  @IsUUID()
  group?: string

  @IsUUID()
  user?: string

  @IsString()
  search?: string

  @IsString()
  queryType: QUERY_TYPE

  @IsEnum(POST_TYPE)
  type: string
}