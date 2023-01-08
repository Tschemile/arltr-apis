import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateReplyInput {
  @IsString()
  @ApiProperty({ type: String })
  content: string
}