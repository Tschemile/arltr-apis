import { Base } from "base";
import { Column, Entity, ManyToOne } from "typeorm";
import { Course } from "./course.entity";

@Entity()
export class Lesson extends Base {
  @ManyToOne(() => Course)
  course: Course

  @Column()
  order: number

  @Column()
  name: string

  @Column()
  content: string

  @Column({ nullable: true })
  question: string

  @Column({ type: 'simple-array', nullable: true })
  answers: string[]

  @Column()
  right: number
}