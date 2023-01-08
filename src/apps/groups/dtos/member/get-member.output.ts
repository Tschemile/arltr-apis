import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Member } from "apps/groups/entities";
import { BaseOutputResponse } from "base";
import { IsArray } from "class-validator";

export class GetMembersOutput extends BaseOutputResponse {
  @IsArray()
  @ApiProperty({ type: [Member] })
  members: Member[]
}

export class GetMemberOutput extends OmitType(BaseOutputResponse, ['total' as const]) {
  @ApiProperty({ type: Member })
  member?: Member
}