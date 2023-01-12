import { USER_ROLE, USER_STATUS } from "apps/profiles/constants";
import { BaseQueryInput } from "base";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class QueryProfileInput extends BaseQueryInput {
  @IsString()
  @IsOptional()
  search?: string

  @IsEnum(USER_ROLE)
  @IsOptional()
  type?: string

  @IsUUID()
  @IsOptional()
  address?: string

  @IsNumber()
  @IsOptional()
  minAge?: number

  @IsNumber()
  @IsOptional()
  maxAge?: number

  @IsEnum(USER_STATUS)
  @IsOptional()
  status?: string

  @IsString()
  @IsOptional()
  gender?: string
}