import { POST_TYPE } from "apps/posts/constants";
import { BaseQueryInput } from "base";
import { IsEnum, IsString, IsUUID } from "class-validator";

export enum POST_QUERY_TYPE {
  COMMUNITY,
  GROUP,
  USER,
}

export type PostQT = keyof typeof POST_QUERY_TYPE

export class QueryPostInput extends BaseQueryInput {
  @IsUUID()
  group?: string

  @IsUUID()
  user?: string

  @IsString()
  search?: string

  @IsString()
  queryType: PostQT

  @IsEnum(POST_TYPE)
  type: string
}