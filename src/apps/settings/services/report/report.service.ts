import { forwardRef, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'apps/auth';
import { CourseService } from 'apps/courses';
import { BlogService, ReplyService } from 'apps/forum';
import { GroupService } from 'apps/groups';
import { JobsService } from 'apps/jobs';
import { CommentService, PostService } from 'apps/posts';
import { ProfileService } from 'apps/profiles';
import { CreateReportDto } from 'apps/settings/dtos/report/create-report.dto';
import { QueryReportInput } from 'apps/settings/dtos/report/query-report.dto';
import { Report } from 'apps/settings/entities';
import { ProductService } from 'apps/shop';
import { BaseError, BaseService } from 'base';
import { Any, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { TableName } from 'utils';
import { CategoryService } from '../category';

const relations = {
  reporter: true,
  category: true,
  user: true,
  commnet: true,
  blog: true,
  reply: true,
  product: true,
  group: true,
  job: true,
  course: true,
};

export class ReportService extends BaseService<Report> {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
    @Inject(forwardRef(() => ProfileService))
    private profileService: ProfileService,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    @Inject(forwardRef(() => PostService))
    private postService: PostService,
    @Inject(forwardRef(() => CommentService))
    private commentService: CommentService,
    @Inject(forwardRef(() => BlogService))
    private blogService: BlogService,
    @Inject(forwardRef(() => ReplyService))
    private replyService: ReplyService,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
    @Inject(forwardRef(() => GroupService))
    private groupService: GroupService,
    @Inject(forwardRef(() => JobsService))
    private jobsService: JobsService,
    @Inject(forwardRef(() => CourseService))
    private courseService: CourseService,
  ) {
    super(reportRepository, relations);
  }

  async create(createReportDto: CreateReportDto, user: UserToken) {
    const {
      user: userId,
      category: categoryId,
      post: postId,
      comment: commentId,
      blog: blogId,
      reply: replyId,
      product: productId,
      group: groupId,
      job: jobId,
      course: courseId,
    } = createReportDto;

    const reporUser = await this.profileService.findOne({
      id: userId,
    });

    if (!reporUser) {
      BaseError(TableName.REPORT, HttpStatus.NOT_FOUND);
    }

    const category = await this.categoryService.findOne({
      id: categoryId,
    });

    if (!category) {
      BaseError(TableName.REPORT, HttpStatus.NOT_FOUND);
    }
    const post = await this.postService.findOne({ id: postId });

    if (!post) {
      BaseError(TableName.REPORT, HttpStatus.NOT_FOUND);
    }
    const comment = await this.commentService.findOne({ id: commentId });
    if (!comment) {
      BaseError(TableName.REPORT, HttpStatus.NOT_FOUND);
    }

    const blog = await this.blogService.findOne({ id: blogId });

    if (!blog) {
      BaseError(TableName.REPORT, HttpStatus.NOT_FOUND);
    }
    const reply = await this.replyService.findOne({ id: replyId });

    if (!reply) {
      BaseError(TableName.REPORT, HttpStatus.NOT_FOUND);
    }
    const product = await this.productService.findOne({ id: productId });

    if (!product) {
      BaseError(TableName.REPORT, HttpStatus.NOT_FOUND);
    }
    const group = await this.groupService.findOne({ id: groupId });

    if (!group) {
      BaseError(TableName.REPORT, HttpStatus.NOT_FOUND);
    }
    const job = await this.jobsService.findOne({ id: jobId });

    if (!job) {
      BaseError(TableName.REPORT, HttpStatus.NOT_FOUND);
    }
    const course = await this.courseService.findOne({ id: courseId });
    if (!course) {
      BaseError(TableName.REPORT, HttpStatus.NOT_FOUND);
    }

    const report = await this.findOne({ reporter: { id: user.profile.id } });

    if (
      report.user.id === userId &&
      report.category.id === categoryId &&
      report.post.id === postId &&
      report.comment.id === commentId &&
      report.blog.id === blogId &&
      report.reply.id === replyId &&
      report.product.id === productId &&
      report.group.id === groupId &&
      report.job.id === jobId &&
      report.course.id === courseId
    ) {
        BaseError(TableName.REPORT, HttpStatus.FORBIDDEN);
    }

    const createReport = this.reportRepository.create({
        ...createReportDto,
        reporter: user.profile,
        user: reporUser,
        category,
        post,
        comment,
        blog,
        reply,
        product,
        group,
        job,
        course,
    });

    await this.reportRepository.save(createReport);

    return {
        report: createReport,
    }
  }

  async findAll( query: QueryReportInput ) {
    const {
        limit = 10,
        reporters = [],
        categorys = [],
        posts = [],
        blogs = [],
        products = [],
        groups = [],
        jobs = [],
        courses = [],
    } = query || {}

    const where: FindOptionsWhere<Report> = {
        reporter : reporters ? Any([reporters]) : Not(IsNull()),
        category : categorys ? Any([categorys]) : Not(IsNull()),
        post : posts ? Any([posts]) : Not(IsNull()),
        blog : blogs ? Any([blogs]) : Not(IsNull()),
        product : products ? Any([products]) : Not(IsNull()),
        group : groups ? Any([groups]) : Not(IsNull()),
        job : jobs ? Any([jobs]) : Not(IsNull()),
        course : courses ? Any([courses]) : Not(IsNull()),
    }
    const { data: reports, total } = await this.find({
        where,
        limit
    });

    return {
        reports, 
        total,
    }
  }
}
