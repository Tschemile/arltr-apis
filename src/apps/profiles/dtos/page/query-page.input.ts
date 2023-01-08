import { BaseQueryInput } from "base";
import { IsString, IsUUID } from "class-validator";

export class QueryPageInput extends BaseQueryInput {
  @IsString()
  search?: string

  @IsUUID()
  address?: string

  @IsUUID()
  category?: string
}