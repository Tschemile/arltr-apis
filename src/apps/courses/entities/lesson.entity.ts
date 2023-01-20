import { ApiProperty } from "@nestjs/swagger";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { DBName } from "utils";
import { Course } from "./course.entity";

@Entity(DBName.LESSON, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class Lesson extends Base {
  @Index()
  @ManyToOne(() => Course, {
    cascade: true,
  })
  @ApiProperty({ type: () => Course })
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