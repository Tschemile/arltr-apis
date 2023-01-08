import { ApiProperty } from "@nestjs/swagger";
import { USER_ROLE } from "apps/profiles/constants";
import { IsDateString, IsEnum, IsLowercase, IsString, IsUUID } from "class-validator";

export class CreateProfileInput {
  @IsString()
  @ApiProperty({ type: String })
  name: string

  @IsLowercase()
  @ApiProperty({ type: String })
  domain: string

  @IsDateString()
  @ApiProperty({ type: String, format: 'date-time' })
  birth: Date

  @IsString()
  @ApiProperty({ type: String })
  gender: string

  @IsEnum(USER_ROLE)
  @ApiProperty({ type: String, enum: USER_ROLE })
  role: string
}