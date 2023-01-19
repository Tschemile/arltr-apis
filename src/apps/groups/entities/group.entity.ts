import { ApiProperty } from "@nestjs/swagger";
import { Base } from "base";
import { Column, Entity, Index } from "typeorm";
import { GROUP_MODE } from "../constants";

@Entity()
export class Group extends Base {
  @Column({ enum: GROUP_MODE })
  @ApiProperty({ type: String, enum: GROUP_MODE })
  mode: string

  @Column()
  @ApiProperty({ type: String })
  name: string

  @Index()
  @Column({ unique: true })
  @ApiProperty({ type: String })
  slug: string

  @Column()
  @ApiProperty({ type: String })
  description: string

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  avatar: string

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  cover: string

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  total: number
}
