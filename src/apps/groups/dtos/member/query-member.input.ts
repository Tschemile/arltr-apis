import { MEMBER_STATUS, QUERY_MEMBER_TYPE } from "apps/groups/constants";
import { BaseQueryInput } from "base";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class QueryMemberInput extends BaseQueryInput {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  search?: string

  @IsEnum(QUERY_MEMBER_TYPE)
  @IsNotEmpty()
  type: string

  @IsEnum(MEMBER_STATUS, { each: true })
  status: string[]

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  group?: string

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  user?: string
}