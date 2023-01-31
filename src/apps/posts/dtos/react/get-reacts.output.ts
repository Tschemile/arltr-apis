import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles";
import { BaseGroupType } from "base";

export class GetReactsOutput {
  @ApiProperty({ type: () => [Profile] })
  users: Profile[]

  @ApiProperty({ type: [BaseGroupType] })
  total: BaseGroupType[]
}