import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendEmailInput {
  @ApiProperty({ type: String })
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  email: string;
}
