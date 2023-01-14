import { ApiProperty, OmitType } from "@nestjs/swagger";
import { BaseOutputResponse } from "base";

export class GetUserTokenOutput  {
  @ApiProperty()
  token?: string
}