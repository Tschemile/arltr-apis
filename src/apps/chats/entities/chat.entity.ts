import { ApiProperty } from "@nestjs/swagger";
import { Base } from "base";
import { Column, Entity, ManyToOne } from "typeorm";
import { CHAT_MODE, CHAT_TYPE } from "../constants";

@Entity()
export class Chat extends Base {
  @Column()
  @ApiProperty({ type: String })
  name: string

  @Column()
  @ApiProperty({ type: String })
  avatar: string

  @Column({ enum: CHAT_TYPE })
  @ApiProperty({ type: String, enum: CHAT_TYPE })
  type: string

  @Column({ enum: CHAT_MODE })
  @ApiProperty({ type: String, enum: CHAT_MODE })
  mode: string

  @Column()
  @ApiProperty({ type: String })
  latestMessage: string
}
