import { ApiProperty } from "@nestjs/swagger";
import { Reply } from "apps/forum/entities";

export class GetReplyOutput {
  @ApiProperty({ type: () => Reply })
  reply?: Reply
}