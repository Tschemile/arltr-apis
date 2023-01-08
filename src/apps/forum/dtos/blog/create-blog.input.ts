import { ApiProperty } from "@nestjs/swagger";
import { BLOG_STATUS } from "apps/forum/constants";
import { IsArray, IsEnum, IsString, IsUUID } from "class-validator";

export class CreateBlogInput {
  @IsString()
  @ApiProperty({ type: String })
  title: string

  @IsUUID()
  @ApiProperty({ type: String })
  category: string

  @IsArray()
  @ApiProperty({ type: [String] })
  tags: string[]

  @IsString()
  @ApiProperty({ type: String })
  body: string

  @IsEnum(BLOG_STATUS)
  @ApiProperty({ type: String })
  status: string
}