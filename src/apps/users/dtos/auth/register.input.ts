import { ApiProperty } from "@nestjs/swagger";
import { USER_ROLE } from "apps/profiles";
import { 
  IsAlpha, 
  IsAlphanumeric, 
  IsDateString, 
  IsEmail, 
  IsEnum, 
  IsLowercase, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  Matches, 
  MaxLength, 
  MinLength 
} from "class-validator";

export class RegisterInput {
  @IsAlpha()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({ type: String })
  firstName: string

  @IsAlpha()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({ type: String })
  lastName: string

  @IsLowercase()
  @IsNotEmpty()
  @MaxLength(20)
  @IsAlphanumeric()
  @ApiProperty({ type: String })
  userName: string

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' })
  @ApiProperty({ type: String })
  password: string

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ type: String, format: 'date-time' })
  birth: Date

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  gender: string

  @IsEnum(USER_ROLE)
  @IsOptional()
  @ApiProperty({ type: String, enum: USER_ROLE })
  role: string
}