import { ApiProperty } from "@nestjs/swagger";
import { Member } from "apps/groups/entities";
import { IsArray } from "class-validator";

export class GetMembersOutput {
  @IsArray()
  @ApiProperty({ type: () => [Member] })
  members: Member[]
}

export class GetMemberOutput {
  @ApiProperty({ type: () => Member })
  member?: Member
}