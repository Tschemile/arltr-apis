import { ApiProperty, OmitType } from "@nestjs/swagger";
import { BaseOutputResponse } from "base";

export class GetUserTokenOutput extends OmitType(BaseOutputResponse, ['total'] as const) {
  @ApiProperty()
  token?: string
}