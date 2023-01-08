import { ApiProperty } from "@nestjs/swagger";
import { IsLowercase, IsString } from "class-validator";

export class LoginInput {
  @IsLowercase()
  @ApiProperty({ type: String })
  usernameOrEmail: string

  @IsString()
  @ApiProperty({ type: String })
  password: string
}