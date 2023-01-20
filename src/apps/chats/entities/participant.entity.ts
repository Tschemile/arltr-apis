import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { DBName } from "utils";
import { PARTICIPANT_ROLE } from "../constants";
import { Chat } from "./chat.entity";

@Entity(DBName.PARTICIPANT, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class Participant extends Base {
  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile})
  user: Profile

  @Index()
  @ManyToOne(() => Chat)
  @ApiProperty({ type: () => Chat})
  chat: Chat

  @Column({ enum: PARTICIPANT_ROLE })
  @ApiProperty({ type: String, enum: PARTICIPANT_ROLE })
  role: string
}