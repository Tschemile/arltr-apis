import { ApiProperty } from "@nestjs/swagger";
import { Reply } from "apps/forum/entities";
import { BaseOutputResponse } from "base";

export class GetReplyOutput extends BaseOutputResponse {
  @ApiProperty({ type: Reply })
  reply?: Reply
}