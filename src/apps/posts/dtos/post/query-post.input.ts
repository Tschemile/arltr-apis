import { POST_TYPE } from "apps/posts/constants";
import { BaseQueryInput } from "base";
import { IsEnum, IsUUID } from "class-validator";

export class QueryPostInput extends BaseQueryInput {
  @IsUUID()
  group?: string

  @IsUUID()
  user?: string

  @IsEnum(POST_TYPE)
  type: string
}