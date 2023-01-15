import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCommentInput {
  @IsUUID()
  @ApiProperty({ type: String })
  post: string

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  content?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  image?: string
}