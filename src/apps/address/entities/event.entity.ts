import { ApiProperty } from "@nestjs/swagger";
import { Group } from "apps/groups";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { EVENT_MODE, EVENT_TYPE } from "../constants";
import { Address } from "./address.entity";

@Entity()
export class Event extends Base {
  @Index()
  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Profile })
  user: Profile

  @Column({ enum: EVENT_TYPE })
  @ApiProperty({ type: String, enum: EVENT_TYPE })
  type: string

  @ManyToOne(() => Address, { nullable: true, onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Address })
  address: Address

  @Column()
  @ApiProperty({ type: String, format: 'date-time'})
  startTime: Date

  @Column()
  @ApiProperty({ type: String, format: 'date-time'})
  endTime: Date

  @ManyToOne(() => Group, { onDelete: 'CASCADE', nullable: true }) 
  @ApiProperty({ type: () => Group })
  group: Group

  @Column({ enum: EVENT_MODE })
  @ApiProperty({ type: String, enum: EVENT_MODE })
  mode: string

  @Column()
  @ApiProperty({ type: String })
  about: string

  @Column({ default: 0 })
  @ApiProperty({ type: Number, default: 0 })
  totalResponded: number
}