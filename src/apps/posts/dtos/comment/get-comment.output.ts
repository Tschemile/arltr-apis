import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Comment } from "apps/posts/entities";
import { BaseOutputResponse } from "base";

export class GetCommentsOutput extends BaseOutputResponse {
  @ApiProperty({ type: [Comment] })
  comments: Comment[]

}

export class GetCommentOutput extends OmitType(BaseOutputResponse, ['total'] as const) {
  @ApiProperty({ type: Comment })
  comment?: Comment
}