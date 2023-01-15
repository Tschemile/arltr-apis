import { ApiProperty } from "@nestjs/swagger";
import { Comment } from "apps/posts/entities";

export class GetCommentsOutput {
  @ApiProperty({ type: () => [Comment] })
  comments: Comment[]

}

export class GetCommentOutput {
  @ApiProperty({ type: () => Comment })
  comment?: Comment
}