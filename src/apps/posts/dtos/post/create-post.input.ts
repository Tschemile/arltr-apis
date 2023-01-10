import { ApiProperty } from "@nestjs/swagger";
import { POST_MODE, POST_STATUS, POST_TYPE } from "apps/posts/constants";
import { IsArray, IsEnum, IsString, IsUrl, IsUUID, MaxLength } from "class-validator";

export class CreatePostInput {
  @IsUUID()
  @ApiProperty({ type: String, nullable: true })
  group?: string

  @IsString()
  @MaxLength(500)
  @ApiProperty({ type: String, nullable: true })
  content?: string

  @IsArray()
  @ApiProperty({ type: [String], nullable: true })
  images?: string[]

  @IsUrl()
  @ApiProperty({ type: String, nullable: true })
  video?: string

  @IsEnum(POST_MODE)
  @ApiProperty({ type: String, nullable: true })
  mode?: string

  @IsEnum(POST_STATUS)
  @ApiProperty({ type: String, nullable: true })
  status?: string

  @IsEnum(POST_TYPE)
  @ApiProperty({ type: String, enum: POST_TYPE })
  type: string
}