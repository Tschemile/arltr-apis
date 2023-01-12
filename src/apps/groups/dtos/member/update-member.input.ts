import { ApiProperty } from "@nestjs/swagger";
import { MEMBER_ROLE, MEMBER_STATUS } from "apps/groups/constants";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateMemberInput {
  @IsEnum(MEMBER_ROLE)
  @IsOptional()
  @ApiProperty({ type: String, enum: MEMBER_ROLE })
  role?: string

  @IsEnum(MEMBER_STATUS)
  @IsOptional()
  @ApiProperty({ type: String, enum: MEMBER_STATUS })
  status?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String })
  archived?: string
}