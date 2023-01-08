import { ApiProperty } from "@nestjs/swagger";
import { MEMBER_ROLE } from "apps/groups/constants";
import { IsEnum, IsUUID } from "class-validator";

export class InviteMemberInput {
  @IsUUID()
  @ApiProperty({ type: String })
  user: string

  @IsUUID()
  @ApiProperty({ type: String })
  group: string

  @IsEnum(MEMBER_ROLE)
  @ApiProperty({ type: String, enum: MEMBER_ROLE })
  role: string
}
