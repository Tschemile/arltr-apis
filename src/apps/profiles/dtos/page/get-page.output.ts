import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Profile } from "apps/profiles/entities";
import { BaseOutputResponse } from "base";
import { IsArray } from "class-validator";

export class GetPagesOutput extends BaseOutputResponse {
  @IsArray()
  @ApiProperty({ type: [Profile ] })
  pages: Profile[]
}

export class GetPageOutput extends OmitType(BaseOutputResponse, ['total' as const]) {
  @ApiProperty({ type: Profile })
  page?: Profile
}