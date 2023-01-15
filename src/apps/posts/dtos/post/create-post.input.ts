import { ApiProperty } from "@nestjs/swagger";
import { POST_MODE, POST_STATUS, POST_TYPE } from "apps/posts/constants";
import { IsArray, IsEnum, IsOptional, IsString, IsUrl, IsUUID, MaxLength } from "class-validator";

export class CreatePostInput {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  group?: string

  @IsString()
  @MaxLength(500)
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  content?: string

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [String], nullable: true })
  images?: string[]

  @IsUrl()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  video?: string

  @IsEnum(POST_MODE)
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  mode?: string

  @IsEnum(POST_STATUS)
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  status?: string

  @IsEnum(POST_TYPE)
  @ApiProperty({ type: String, enum: POST_TYPE })
  type: string
}