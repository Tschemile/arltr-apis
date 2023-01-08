import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, ManyToOne } from "typeorm";
import { Chat } from "./chat.entity";

@Entity()
export class Message extends Base {
  @ManyToOne(() => Profile)
  sender: Profile

  @ManyToOne(() => Chat)
  chat: Chat

  @Column()
  content: string

  @Column({ nullable: true })
  image: string

  @Column({ nullable: true })
  file: string
}

