import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { REACT_TYPE } from "../constants";
import { Post } from "./post.entity";
import { Comment } from "./comment.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class React extends Base {
  @ManyToOne(() => Post, { nullable: true })
  @ApiProperty({ type: () => Post })
  post: Post

  @ManyToOne(() => Comment, { nullable: true })
  @ApiProperty({ type: () => Comment })
  comment: Comment

  @Index()
  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  user: Profile

  @Column({ enum: REACT_TYPE })
  @ApiProperty({ type: String, enum: REACT_TYPE })
  type: string
}