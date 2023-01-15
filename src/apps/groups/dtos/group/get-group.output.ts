import { ApiProperty } from "@nestjs/swagger";
import { Group } from "apps/groups/entities";
import { IsArray } from "class-validator";

export class GetGroupsOutput {
  @IsArray()
  @ApiProperty({ type: () => [Group] })
  groups: Group[]
}

export class GetGroupOutput {
  @ApiProperty({ type: () => Group })
  group?: Group
}