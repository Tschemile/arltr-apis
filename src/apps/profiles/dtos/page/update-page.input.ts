import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";
import { CreatePageInput } from "./create-page.input";

export class UpdatePageInput extends PartialType(CreatePageInput) {
  @IsUrl()
  @IsOptional()
  @ApiProperty({ type: String })
  avatar?: string

  @IsUrl()
  @IsOptional()
  @ApiProperty({ type: String })
  cover?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String })
  about?: string
}