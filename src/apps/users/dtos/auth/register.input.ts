import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsAlphanumeric, IsDateString, IsEmail, IsLowercase, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterInput {
  @IsAlpha()
  @MaxLength(20)
  @ApiProperty({ type: String })
  firstName: string

  @IsAlpha()
  @MaxLength(20)
  @ApiProperty({ type: String })
  lastName: string

  @IsLowercase()
  @MaxLength(20)
  @IsAlphanumeric()
  @ApiProperty({ type: String })
  username: string

  @IsEmail()
  @ApiProperty({ type: String })
  email: string

  @IsString()
  @MinLength(4)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak'})
  @ApiProperty({ type: String })
  password: string

  @IsDateString()
  @ApiProperty({ type: String, format: 'date-time' })
  birth: Date

  @IsString()
  @ApiProperty({ type: String })
  gender: string
}