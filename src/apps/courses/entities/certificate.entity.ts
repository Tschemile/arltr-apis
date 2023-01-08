import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, ManyToOne } from "typeorm";
import { Course } from "./course.entity";

@Entity()
export class Certificate extends Base {
  @ManyToOne(() => Course)
  course: Course

  @ManyToOne(() => Profile)
  user: Profile

  @Column({ default: 0 })
  process: number

  @Column()
  badge: string

  @Column({ default: 0 })
  duration: string

  @Column()
  blocked: boolean
}