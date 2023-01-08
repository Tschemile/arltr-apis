import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Profile } from "apps/profiles/entities";
import { BaseOutputResponse } from "base";
import { IsArray } from "class-validator";

export class GetProfilesOutput extends BaseOutputResponse {
  @IsArray()
  @ApiProperty({ type: [Profile ] })
  profiles: Profile[]
}

export class GetProfileOutput extends OmitType(BaseOutputResponse, ['total' as const]) {
  @ApiProperty({ type: Profile })
  profile?: Profile
}