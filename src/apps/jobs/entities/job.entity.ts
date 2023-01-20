import { Address } from "apps/address";
import { Base } from "base";
import { Category } from "apps/settings";
import { Profile } from "apps/profiles";
import { Column, Entity, ManyToOne } from "typeorm";
import { JOB_CAREER, JOB_GENDER, JOB_QUALIFICATION, JOB_TYPE, SALARY_TYPE } from "../constants";
import { ApiProperty } from "@nestjs/swagger";
import { DBName } from "utils";

@Entity(DBName.JOB, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class Job extends Base {
  @ManyToOne(() => Profile, { cascade: true })
  @ApiProperty({ type: () => Profile })
  employer: Profile

  @ManyToOne(() => Address, { cascade: true })
  @ApiProperty({ type: () => Address })
  address: Address

  @Column()
  @ApiProperty({ type: String })
  title: string

  @Column()
  @ApiProperty({ type: String })
  image: string

  @Column()
  @ApiProperty({ type: String })
  description: string

  @ManyToOne(() => Category, { cascade: true })
  @ApiProperty({ type: () => Category })
  category: Category

  @Column({ enum: JOB_TYPE, default: JOB_TYPE.FULL_TIME })
  @ApiProperty({ type: String, enum: JOB_TYPE })
  type: string

  @Column({ enum: JOB_GENDER, default: JOB_GENDER.FEMALE })
  @ApiProperty({ type: String, enum: JOB_GENDER })
  gender: string

  @Column({ enum: SALARY_TYPE, default: SALARY_TYPE.MONTHLY })
  @ApiProperty({ type: String, enum: SALARY_TYPE })
  salaryType: string

  @Column()
  @ApiProperty({ type: Number })
  minSalary: number

  @Column()
  @ApiProperty({ type: Number })
  maxSalary: number

  @Column()
  @ApiProperty({ type: String })
  experience: string

  @Column({ enum: JOB_CAREER, default: JOB_CAREER.EXECUTIVE  })
  @ApiProperty({ type: String, enum: JOB_CAREER })
  career: string

  @Column({ enum: JOB_QUALIFICATION, default: JOB_QUALIFICATION.ASSOCIATE_DEGREE })
  @ApiProperty({ type: String, enum: JOB_QUALIFICATION })
  qualification: string

  @Column()
  @ApiProperty({ type: String, format: 'date-time' })
  expiredAt: Date
}
