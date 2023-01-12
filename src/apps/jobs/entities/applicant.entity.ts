import { ApiProperty } from "@nestjs/swagger";
import { Base } from "base";
import { Column, Entity, ManyToOne } from "typeorm";
import { APPLICANT_STATUS } from "../constants";
import { Job } from "./job.entity";
import { Resume } from "./resume.entity";

@Entity()
export class Applicant extends Base {
  @ManyToOne(() => Resume, {
    cascade: true
  })
  resume: Resume

  @ManyToOne(() => Job)
  job: Job

  @Column({ enum: APPLICANT_STATUS, default: APPLICANT_STATUS.PENDING })
  @ApiProperty({ type: String, enum: APPLICANT_STATUS })
  status: string

  @Column({ nullable: true })
  @ApiProperty({ type: String, format: 'date-time' })
  appliedAt: Date
}