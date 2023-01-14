import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, ManyToOne } from "typeorm";
import { MEMBER_ROLE, MEMBER_STATUS } from "../constants";
import { Group } from "./group.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Member extends Base {
  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  user: Profile

  @ManyToOne(() => Group)
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