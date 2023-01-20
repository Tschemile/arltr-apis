import { ApiProperty } from "@nestjs/swagger";

export class GetUserTokenOutput  {
  @ApiProperty()
  token?: string
}