import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateReplyInput {
  @IsUUID()
  @ApiProperty({ type: String })
  blog: string

  @IsString()
  @ApiProperty({ type: String })
  content: string
}