import { ApiProperty } from "@nestjs/swagger";
import { Certificate } from "apps/courses";
import { Reply, Vote } from "apps/forum";
import { Applicant } from "apps/jobs";
import { Comment, React } from "apps/posts";
import { Profile, Relation } from "apps/profiles";
import { Order, Review } from "apps/shop";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";

@Entity()
export class Activity extends Base {
  @Index()
  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  user: Profile

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  notify: Profile

  @ManyToOne(() => React, { onDelete: 'CASCADE', nullable: true })
  react: React

  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: true })
  comment: Comment

  @ManyToOne(() => Vote, { onDelete: 'CASCADE', nullable: true })
  vote: Vote

  @ManyToOne(() => Reply, { onDelete: 'CASCADE', nullable: true })
  reply: Reply

  @ManyToOne(() => Order, { onDelete: 'CASCADE', nullable: true })
  order: Order

  @ManyToOne(() => Review, { onDelete: 'CASCADE', nullable: true })
  review: Review

  @ManyToOne(() => Applicant, { onDelete: 'CASCADE', nullable: true })
  applicant: Applicant

  @ManyToOne(() => Certificate, { onDelete: 'CASCADE', nullable: true })
  certificate: Certificate

  @ManyToOne(() => Relation, { onDelete: 'CASCADE', nullable: true })
  relation: Relation

  @Column()
  @ApiProperty({ type: String })
  notification: string
}
