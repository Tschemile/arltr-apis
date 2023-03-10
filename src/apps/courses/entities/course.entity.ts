import { Category } from "apps/settings";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { DBName } from "utils";

@Entity(DBName.COURSE, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class Course extends Base {
  @Index()
  @ManyToOne(() => Profile, {
    cascade: true,
  })
  @ApiProperty({ type: () => Profile })
  author: Profile

  @Column()
  @ApiProperty({ type: String })
  name: string

  @ManyToOne(() => Category, {
    cascade: true,
  })
  @ApiProperty({ type: () => Category })
  category: Category

  @Column()
  @ApiProperty({ type: String })
  description: string

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  lessons: number

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  time: number

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  participants: number
}
