import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, ManyToOne } from "typeorm";
import { PARTICIPANT_ROLE } from "../constants";
import { Chat } from "./chat.entity";

@Entity()
export class Participant extends Base {
  @ManyToOne(() => Profile)
  user: Profile

  @ManyToOne(() => Chat)
  chat: Chat

  @Column({ enum: PARTICIPANT_ROLE })
  role: string
}