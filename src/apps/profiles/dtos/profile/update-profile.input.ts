import { ApiProperty, PartialType } from "@nestjs/swagger";
import { USER_STATUS } from "apps/profiles/constants";
import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from "class-validator";
import { CreateProfileInput } from "./create-profile.input";

export class UpdateProfileInput extends PartialType(CreateProfileInput) { 
  @IsUrl()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  avatar?: string

  @IsUrl()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  cover?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String })
  about?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String })
  work?: string

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [String] })
  socialLinks?: string[]

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [String] })
  hobbies?: string[]

  @IsEnum(USER_STATUS)
  @IsOptional()
  @ApiProperty({ type: String, enum: USER_STATUS })
  status?: string
}