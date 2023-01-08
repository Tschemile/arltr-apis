import { ApiProperty, PartialType } from "@nestjs/swagger";
import { USER_STATUS } from "apps/profiles/constants";
import { IsArray, IsEnum, IsString, IsUrl } from "class-validator";
import { CreateProfileInput } from "./create-profile.input";

export class UpdateProfileInput extends PartialType(CreateProfileInput) { 
  @IsUrl()
  @ApiProperty({ type: String })
  avatar?: string

  @IsUrl()
  @ApiProperty({ type: String })
  cover?: string

  @IsString()
  @ApiProperty({ type: String })
  about?: string

  @IsString()
  @ApiProperty({ type: String })
  work?: string

  @IsArray()
  @ApiProperty({ type: [String] })
  socialLinks?: string[]

  @IsArray()
  @ApiProperty({ type: [String] })
  hobbies?: string[]

  @IsEnum(USER_STATUS)
  @ApiProperty({ type: String, enum: USER_STATUS })
  status?: string
}