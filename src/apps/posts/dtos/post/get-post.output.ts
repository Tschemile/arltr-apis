import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Post } from "apps/posts/entities";
import { BaseOutputResponse } from "base";

export class GetPostsOutput extends BaseOutputResponse {
  @ApiProperty({ type: () => [Post] })
  posts: Post[]

}

export class GetPostOutput extends OmitType(BaseOutputResponse, ['total'] as const) {
  @ApiProperty({ type: () => Post })
  post?: Post
}