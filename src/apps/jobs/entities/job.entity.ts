import { Address } from "apps/address";
import { Base } from "base";
import { Category } from "apps/settings";
import { Profile } from "apps/profiles";
import { Column, Entity, ManyToOne } from "typeorm";
import { JOB_CAREER, JOB_GENDER, JOB_QUALIFICATION, JOB_TYPE, SALARY_TYPE } from "../constants";

@Entity()
export class Job extends Base {
  @ManyToOne(() => Profile)
  employer: Profile

  @ManyToOne(() => Address)
  address: Address

  @Column()
  title: string

  @Column()
  image: string

  @Column()
  description: string

  @ManyToOne(() => Category)
  category: Category

  @Column({ enum: JOB_TYPE })
  type: string

  @Column({ enum: JOB_GENDER })
  gender: string

  @Column({ enum: SALARY_TYPE })
  salaryType: string

  @Column()
  minSalary: number

  @Column()
  maxSalary: number

  @Column()
  experience: string

  @Column({ enum: JOB_CAREER })
  career: string

  @Column({ enum: JOB_QUALIFICATION })
  qualification: string

  @Column()
  expiredAt: Date
}
