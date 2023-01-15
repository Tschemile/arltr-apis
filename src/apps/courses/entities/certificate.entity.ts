import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, ManyToOne } from "typeorm";
import { Course } from "./course.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Certificate extends Base {
  @ManyToOne(() => Course, {
    cascade: true,
  })
  course: Course

  @ManyToOne(() => Profile)
  user: Profile

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  process: number

  @Column()
  @ApiProperty({ type: String })
  badge: string

  @Column({ default: 0 })
  @ApiProperty({ type: String })
  duration: string

  @Column()
  @ApiProperty({ type: Boolean })
  blocked: boolean
}