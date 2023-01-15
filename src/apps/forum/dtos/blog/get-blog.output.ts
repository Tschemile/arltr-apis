import { ApiProperty } from "@nestjs/swagger";
import { Blog } from "apps/forum/entities";

export class GetBlogsOutput {
  @ApiProperty({ type: () => [Blog] })
  blogs: Blog[]
}

export class GetBlogOutput {
  @ApiProperty({ type: () => Blog })
  blog?: Blog
}