import { ApiProperty } from "@nestjs/swagger";
import { MEMBER_ROLE, MEMBER_STATUS } from "apps/groups/constants";
import { IsEnum, IsString } from "class-validator";

export class UpdateMemberInput {
  @IsEnum(MEMBER_ROLE)
  @ApiProperty({ type: String, enum: MEMBER_ROLE })
  role?: string

  @IsEnum(MEMBER_STATUS)
  @ApiProperty({ type: String, enum: MEMBER_STATUS })
  status?: string

  @IsString()
  @ApiProperty({ type: String })
  archived?: string
}