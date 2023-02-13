import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { MEMBER_ROLE, MEMBER_STATUS } from "../constants";
import { Group } from "./group.entity";
import { ApiProperty } from "@nestjs/swagger";
import { DBName } from "utils";

@Entity(DBName.MEMBER, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class Member extends Base {
  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Profile })
  user: Profile

  @Index()
  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Group })
  group: Group

  @Column({ enum: MEMBER_ROLE })
  @ApiProperty({ type: String, enum: MEMBER_ROLE })
  role: string

  @Column({ enum: MEMBER_STATUS })
  @ApiProperty({ type: String, enum: MEMBER_STATUS })
  status: string

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  archived: string
}