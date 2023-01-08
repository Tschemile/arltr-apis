import { Base } from "base";
import { Column, Entity, ManyToOne } from "typeorm";
import { CHAT_MODE, CHAT_TYPE } from "../constants";

@Entity()
export class Chat extends Base {
  @Column()
  name: string

  @Column()
  avatar: string

  @Column({ enum: CHAT_TYPE })
  type: string

  @Column({ enum: CHAT_MODE })
  mode: string

  @Column()
  latestMessage: string
}
