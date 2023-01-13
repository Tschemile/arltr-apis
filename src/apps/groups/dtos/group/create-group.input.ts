import { ApiProperty } from "@nestjs/swagger";
import { GROUP_MODE } from "apps/groups/constants";
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateGroupInput {
  @IsEnum(GROUP_MODE)
  @ApiProperty({ type: String, enum: GROUP_MODE })
  mode: string

  @IsString()
  @ApiProperty({ type: String })
  name: string

  @IsString()
  @MaxLength(200)
  @ApiProperty({ type: String })
  description: string

  @IsUrl()
  @IsOptional()
  @ApiProperty({ type: String })
  avatar: string

  @IsUrl()
  @IsOptional()
  @ApiProperty({ type: String })
  cover: string
}