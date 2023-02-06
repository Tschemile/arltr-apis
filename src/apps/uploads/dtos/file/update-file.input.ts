import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateFileInput {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  album: string
}