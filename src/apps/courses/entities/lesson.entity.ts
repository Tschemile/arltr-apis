import { ApiProperty } from "@nestjs/swagger";
import { Base } from "base";
import { Column, Entity, ManyToOne } from "typeorm";
import { Course } from "./course.entity";

@Entity()
export class Lesson extends Base {
  @ManyToOne(() => Course, {
    cascade: true,
  })
  course: Course

  @Column()
  @ApiProperty({ type: Number })
  order: number

  @Column()
  @ApiProperty({ type: String })
  name: string

  @Column()
  @ApiProperty({ type: String })
  content: string

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  question: string

  @Column({ type: 'simple-array', nullable: true })
  @ApiProperty({ type: [String] })
  answers: string[]

  @Column()
  @ApiProperty({ type: Number })
  right: number
}