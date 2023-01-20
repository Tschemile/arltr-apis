import { ApiProperty } from "@nestjs/swagger";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { DBName } from "utils";
import { APPLICANT_STATUS } from "../constants";
import { Job } from "./job.entity";
import { Resume } from "./resume.entity";

@Entity(DBName.APPLICANT, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class Applicant extends Base {
  @ManyToOne(() => Resume, { cascade: true })
  @ApiProperty({ type: () => Resume })
  resume: Resume

  @Index()
  @ManyToOne(() => Job, { cascade: true })
  @ApiProperty({ type: () => Job })
  job: Job

  @Column({ enum: APPLICANT_STATUS, default: APPLICANT_STATUS.PENDING })
  @ApiProperty({ type: String, enum: APPLICANT_STATUS })
  status: string

  @Column({ nullable: true })
  @ApiProperty({ type: Date })
  appliedAt: Date
}