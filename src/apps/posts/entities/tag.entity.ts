import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Entity, ManyToOne } from "typeorm";
import { DBName } from "utils";
import { Post } from "./post.entity";

@Entity(DBName.TAG, {
  orderBy: {
    createdAt: 'DESC'
  }
})
export class Tag extends Base {
  @ManyToOne(() => Post)
  @ApiProperty({ type: () => Post })
  post: Post

  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  user: Profile
}