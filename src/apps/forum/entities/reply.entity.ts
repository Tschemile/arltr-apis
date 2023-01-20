import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Blog } from "./blog.entity";
import { ApiProperty } from "@nestjs/swagger";
import { DBName } from "utils";

@Entity(DBName.REPLY, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class Reply extends Base {
  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  user: Profile

  @Index()
  @ManyToOne(() => Blog)
  @ApiProperty({ type: () => Blog })
  blog: Blog

  @Column()
  @ApiProperty({ type: String })
  content: string

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  votes: number
}