import { BLOG_STATUS } from "apps/forum/constants";
import { BaseQueryInput } from "base";
import { IsArray, IsEnum, IsString, IsUUID } from "class-validator";

export type QUERY_TYPE = 'COMMUNITY' | 'SELF'

export class QueryBlogInput extends BaseQueryInput {
  @IsString()
  type: QUERY_TYPE
  
  @IsString()
  search?: string

  @IsArray()
  categories?: string[]

  @IsArray()
  tags?: string[]

  @IsUUID()
  author?: string

  @IsEnum(BLOG_STATUS)
  status?: string
}