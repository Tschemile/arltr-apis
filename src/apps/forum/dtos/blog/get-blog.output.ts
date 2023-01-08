import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Blog } from "apps/forum/entities";
import { BaseOutputResponse } from "base";

export class GetBlogsOutput extends BaseOutputResponse {
  @ApiProperty({ type: [Blog] })
  blogs: Blog[]
}

export class GetBlogOutput extends OmitType(BaseOutputResponse, ['total'] as const) {
  @ApiProperty({ type: Blog })
  blog?: Blog
}