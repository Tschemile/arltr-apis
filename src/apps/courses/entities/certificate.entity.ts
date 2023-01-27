import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Course } from "./course.entity";
import { ApiProperty } from "@nestjs/swagger";
import { DBName } from "utils";

@Entity(DBName.CERTIFICATE, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class Certificate extends Base {
  @Index()
  @ManyToOne(() => Course, {
    cascade: true,
  })
  @ApiProperty({ type: () => Course })
  course: Course

  @ManyToOne(() => Profile, { cascade: true})
  @ApiProperty({ type: () => Profile })
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