import { ApiProperty } from "@nestjs/swagger";
import { Group, Member } from "apps/groups/entities";
import { IsArray } from "class-validator";

export class GroupFully extends Group {
  member: Member
}

export class GetGroupsOutput {
  @IsArray()
  @ApiProperty({ type: () => [Group] })
  groups: Group[]
}

export class GetGroupFullOutput {
  @ApiProperty({ type: () => GroupFully })
  group: GroupFully
}


export class GetGroupOutput {
  @ApiProperty({ type: () => Group })
  group?: Group
}