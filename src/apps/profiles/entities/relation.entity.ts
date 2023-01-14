import { ApiProperty } from "@nestjs/swagger";
import { Base } from "base";
import { Column, Entity, ManyToOne } from "typeorm";
import { FRIEND_STATUS, RELATION_TYPE } from "../constants";
import { Profile } from "./profile.entity";

@Entity()
export class Relation extends Base {
  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  requester: Profile

  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  user: Profile

  @Column({ enum: RELATION_TYPE })
  @ApiProperty({ type: String, enum: RELATION_TYPE })
  type: string

  @Column({ enum: FRIEND_STATUS, nullable: true })
  @ApiProperty({ type: String, enum: FRIEND_STATUS })
  status: string
}