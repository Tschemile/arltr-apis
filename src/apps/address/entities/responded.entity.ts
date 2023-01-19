import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { RESPONDED_TYPE } from "../constants";
import { Event } from "./event.entity";

@Entity()
export class Responded extends Base {
  @ManyToOne(() => Profile, { onDelete: 'CASCADE'})
  @ApiProperty({ type: () => Profile })
  user: Profile

  @Index()
  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Event })
  event: Event

  @Column({ enum: RESPONDED_TYPE })
  @ApiProperty({ type: String, enum: RESPONDED_TYPE })
  type: string
}