import { BaseQueryInput } from "base";
import { IsUUID } from "class-validator";

export class QueryFileInput extends BaseQueryInput {
  @IsUUID()
  user: string

  @IsUUID()
  album?: string
}