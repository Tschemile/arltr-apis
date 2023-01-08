import { USER_ROLE, USER_STATUS } from "apps/profiles/constants";
import { BaseQueryInput } from "base";
import { IsEnum, IsNumber, IsString, IsUUID } from "class-validator";

export class QueryProfileInput extends BaseQueryInput {
  @IsString()
  search?: string

  @IsEnum(USER_ROLE)
  type?: string

  @IsUUID()
  address?: string

  @IsNumber()
  minAge?: number

  @IsNumber()
  maxAge?: number

  @IsEnum(USER_STATUS)
  status?: string

  @IsString()
  gender?: string
}