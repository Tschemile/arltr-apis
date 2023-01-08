import { Category } from "apps/settings";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Course extends Base {
  @ManyToOne(() => Profile)
  author: Profile

  @Column()
  name: string

  @ManyToOne(() => Category)
  category: Category

  @Column()
  description: string

  @Column({ default: 0 })
  lessons: number

  @Column({ default: 0 })
  time: number

  @Column({ default: 0 })
  participants: number
}
