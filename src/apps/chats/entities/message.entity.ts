import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Chat } from "./chat.entity";

@Entity()
export class Message extends Base {
  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  sender: Profile

  @Index()
  @ManyToOne(() => Chat)
  @ApiProperty({ type: () => Chat })
  chat: Chat

  @Column()
  @ApiProperty({ type: String })
  content: string

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  image: string

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  file: string
}

