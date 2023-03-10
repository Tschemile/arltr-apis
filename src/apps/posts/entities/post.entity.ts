import { ApiProperty } from "@nestjs/swagger";
import { Event } from "apps/address";
import { Group } from "apps/groups";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { DBName } from "utils";
import { POST_MODE, POST_STATUS, POST_TYPE } from "../constants";

@Entity(DBName.POST, {
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Post extends Base {
  @Index()
  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  author: Profile

  @ManyToOne(() => Post, { nullable: true })
  @ApiProperty({ type: () => Post, nullable: true })
  linked: Post

  @ManyToOne(() => Group, { nullable: true })
  @ApiProperty({ type: () => Group, nullable: true })
  group: Group

  @ManyToOne(() => Event, { nullable: true })
  @ApiProperty({ type: () => Event, nullable: true })
  event: Event 

  @Column({ enum: POST_TYPE, default: POST_TYPE.POST })
  @ApiProperty({ type: String, enum: POST_TYPE })
  type: string
  
  @Column({ nullable: true })
  @ApiProperty({ type: String })
  content: string

  @Column({ type: 'simple-array', nullable: true })
  @ApiProperty({ type: String })
  images: string[]

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  video: string

  @Column({ enum: POST_MODE, default: POST_MODE.PUBLIC })
  @ApiProperty({ type: String, enum: POST_MODE })
  mode: string

  @Column({ enum: POST_STATUS, default: POST_STATUS.ACTIVE })
  @ApiProperty({ type: String, enum: POST_STATUS })
  status: string

  @Column({ default: false })
  @ApiProperty({ type: Boolean })
  disableComment: boolean

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  totalShares: number

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  totalReacts: number

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  totalComments: number
}
