import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, ManyToOne } from "typeorm";
import { Blog } from "./blog.entity";
import { Reply } from "./reply.entity";

@Entity()
export class Vote extends Base {
  @ManyToOne(() => Profile)
  user: Profile

  @ManyToOne(() => Blog, { nullable: true })
  blog: Blog

  @ManyToOne(() => Reply, { nullable: true })
  reply: Reply

  @Column()
  vote: boolean
}