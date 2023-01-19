import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class Comment extends Base {
  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  user: Profile

  @Index()
  @ManyToOne(() => Post)
  @ApiProperty({ type: Post })
  post: Post

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  content: string

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  image: string

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  totalReacts: number
}