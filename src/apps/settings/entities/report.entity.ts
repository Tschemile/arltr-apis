import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'apps/courses';
import { Blog, Reply } from 'apps/forum';
import { Group } from 'apps/groups';
import { Job } from 'apps/jobs';
import { Comment, Post } from 'apps/posts';
import { Profile } from 'apps/profiles';
import { Product } from 'apps/shop';
import { Base } from 'base';
import { Entity, Index, ManyToOne } from 'typeorm';
import { DBName } from 'utils';
import { Category } from './category.entity';

@Entity(DBName.REPORT, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class Report extends Base {
  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Profile })
  reporter: Profile;

  @Index()
  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Category })
  category: Category;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE', nullable: true })
  @ApiProperty({ type: () => Profile })
  user: Profile;

  @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: true })
  @ApiProperty({ type: () => Post })
  post: Post;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: true })
  @ApiProperty({ type: () => Comment })
  comment: Comment;

  @ManyToOne(() => Blog, { onDelete: 'CASCADE', nullable: true })
  @ApiProperty({ type: () => Blog })
  blog: Blog;

  @ManyToOne(() => Reply, { onDelete: 'CASCADE', nullable: true })
  @ApiProperty({ type: () => Reply })
  reply: Reply;

  @ManyToOne(() => Product, { onDelete: 'CASCADE', nullable: true })
  @ApiProperty({ type: () => Product })
  product: Product;

  @ManyToOne(() => Group, { onDelete: 'CASCADE', nullable: true })
  @ApiProperty({ type: () => Group })
  group: Group;

  @ManyToOne(() => Job, { onDelete: 'CASCADE', nullable: true })
  @ApiProperty({ type: () => Job })
  job: Job;

  @ManyToOne(() => Course, { onDelete: 'CASCADE', nullable: true })
  @ApiProperty({ type: () => Course })
  course: Course;
}
