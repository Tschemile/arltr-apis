import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Entity, ManyToOne } from "typeorm";
import { DBName } from "utils";
import { Comment } from "./comment.entity";
import { Post } from "./post.entity";

@Entity(DBName.TAG, {
  orderBy: {
    createdAt: 'DESC'
  }
})
export class Tag extends Base {
  @ManyToOne(() => Post, { nullable: true })
  @ApiProperty({ type: () => Post })
  post: Post

  @ManyToOne(() => Comment, { nullable: true })
  @ApiProperty({ type: () => Comment })
  comment: Comment

  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  user: Profile
}