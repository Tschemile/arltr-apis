import { Base } from "base";
import { Column, Entity, ManyToOne } from "typeorm";
import { APPLICANT_STATUS } from "../constants";
import { Job } from "./job.entity";
import { Resume } from "./resume.entity";

@Entity()
export class Applicant extends Base {
  @ManyToOne(() => Resume)
  resume: Resume

  @ManyToOne(() => Job)
  job: Job

  @Column({ enum: APPLICANT_STATUS, default: APPLICANT_STATUS.PENDING })
  status: string

  @Column({ nullable: true })
  appliedAt: Date
}