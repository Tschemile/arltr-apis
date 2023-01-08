import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateCommentInput {
  @IsUUID()
  @ApiProperty({ type: String })
  post: string

  @IsString()
  @ApiProperty({ type: String, nullable: true })
  content?: string

  @IsString()
  @ApiProperty({ type: String, nullable: true })
  image?: string
}