import { ApiProperty } from "@nestjs/swagger";
import { Reply } from "apps/forum/entities";

export class GetReplyOutput {
  @ApiProperty({ type: () => Reply })
  reply?: Reply
}

export class GetRepliesOutput {
  @ApiProperty({ type: () => [Reply] })
  replies: Reply[]

  @ApiProperty({ type: Number })
  total: number
}