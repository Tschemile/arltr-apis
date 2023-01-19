import { Base } from "base";
import { Category } from "apps/settings";
import { Profile } from "apps/profiles";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { BLOG_STATUS } from "../constants";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Blog extends Base {
  @Column()
  @ApiProperty({ type: String })
  title: string

  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  author: Profile

  @ManyToOne(() => Category)
  @ApiProperty({ type: () => Category })
  category: Category

  @Column({ type: 'simple-array' })
  @ApiProperty({ type: [String] })
  tags: string[]

  @Column()
  @ApiProperty({ type: String })
  body: string

  @Column({ enum: BLOG_STATUS })
  @ApiProperty({ type: String, enum: BLOG_STATUS })
  status: string

  @Index()
  @Column({ unique: true })
  @ApiProperty({ type: String })
  slug: string

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  votes: number
}