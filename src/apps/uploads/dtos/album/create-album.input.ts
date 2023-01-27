import { ApiProperty } from "@nestjs/swagger";
import { FILE_SCOPE } from "apps/uploads/constants";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateAlbumInput {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  name: string

  @IsEnum(FILE_SCOPE)
  @ApiProperty({ type: String, enum: FILE_SCOPE })
  mode: string
}