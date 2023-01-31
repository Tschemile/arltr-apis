import { Type } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

export class BaseQueryInput {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  page?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number
}
