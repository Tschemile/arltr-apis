import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Group } from "apps/groups/entities";
import { BaseOutputResponse } from "base";
import { IsArray } from "class-validator";

export class GetGroupsOutput extends BaseOutputResponse {
  @IsArray()
  @ApiProperty({ type: () => [Group] })
  groups: Group[]
}

export class GetGroupOutput extends OmitType(BaseOutputResponse, ['total' as const]) {
  @ApiProperty({ type: () => Group })
  group?: Group
}