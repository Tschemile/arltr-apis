import { ApiProperty } from "@nestjs/swagger";
import { Post } from "apps/posts/entities";

export class GetPostsOutput {
  @ApiProperty({ type: () => [Post] })
  posts: Post[]

}

export class GetPostOutput {
  @ApiProperty({ type: () => Post })
  post?: Post
}