import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsLowercase, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginInput {
  @IsLowercase()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  usernameOrEmail: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  password: string

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: Boolean })
  isRemember?: boolean
}