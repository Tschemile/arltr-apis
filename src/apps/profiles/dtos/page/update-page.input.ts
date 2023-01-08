import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString, IsUrl } from "class-validator";
import { CreatePageInput } from "./create-page.input";

export class UpdatePageInput extends PartialType(CreatePageInput) {
  @IsUrl()
  @ApiProperty({ type: String })
  avatar?: string

  @IsUrl()
  @ApiProperty({ type: String })
  cover?: string

  @IsString()
  @ApiProperty({ type: String })
  about?: string
}