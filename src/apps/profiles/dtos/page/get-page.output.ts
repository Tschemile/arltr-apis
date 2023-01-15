import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles/entities";

export class GetPagesOutput {
  @ApiProperty({ type: () => [Profile] })
  pages: Profile[]

  @ApiProperty({ type: Number })
  total: number
}

export class GetPageOutput {
  @ApiProperty({ type: () => Profile })
  page: Profile
}