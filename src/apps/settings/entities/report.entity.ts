import { ApiProperty } from "@nestjs/swagger";
import { Course } from "apps/courses";
import { Blog, Reply } from "apps/forum";
import { Group } from "apps/groups";
import { Job } from "apps/jobs";
import { Comment, Post } from "apps/posts";
import { Profile } from "apps/profiles";
import { Product } from "apps/shop";
import { Base } from "base";
import { Entity, ManyToOne } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Report extends Base {
  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  reporter: Profile

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  category: Category

  @ManyToOne(() => Profile, { onDelete: 'CASCADE', nullable: true })
  user: Profile

  @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: true })
  post: Post

  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: true })
  comment: Comment

  @ManyToOne(() => Blog, { onDelete: 'CASCADE', nullable: true })
  blog: Blog

  @ManyToOne(() => Reply, { onDelete: 'CASCADE', nullable: true })
  reply: Reply

  @ManyToOne(() => Product, { onDelete: 'CASCADE', nullable: true })
  product: Product

  @ManyToOne(() => Group, { onDelete: 'CASCADE', nullable: true })
  group: Group

  @ManyToOne(() => Job, { onDelete: 'CASCADE', nullable: true })
  job: Job

  @ManyToOne(() => Course, { onDelete: 'CASCADE', nullable: true })
  course: Course
}