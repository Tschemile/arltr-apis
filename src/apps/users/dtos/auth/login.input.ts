import { ApiProperty } from "@nestjs/swagger";
import { IsLowercase, IsNotEmpty, IsString } from "class-validator";

export class LoginInput {
  @IsLowercase()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  usernameOrEmail: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  password: string
}