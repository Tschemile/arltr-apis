import { ApiProperty } from "@nestjs/swagger";
import { CATEGORY_MODULE } from "apps/settings/constants";
import { IsAlpha, IsEnum, IsUrl } from "class-validator";

export class CreateCategoryInput {
  @IsAlpha()
  @ApiProperty({ type: String })
  name: string

  @IsUrl()
  @ApiProperty({ type: String })
  image: string

  @IsEnum(CATEGORY_MODULE)
  @ApiProperty({ type: String, enum: CATEGORY_MODULE })
  module: string
}