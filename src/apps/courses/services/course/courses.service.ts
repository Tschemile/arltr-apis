import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'apps/auth';
import { UpdateCourseDto, CreateCourseDto, QueryCourseInput } from 'apps/courses/dto';
import { Course } from 'apps/courses/entities';
import { ProfileService } from 'apps/profiles';
import { CategoryService } from 'apps/settings';
import { BaseError, BaseService } from 'base';
import { Any, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { ModuleName } from 'utils';

const courseRelations = {
  author: true,
  category: true,
};

@Injectable()
export class CourseService extends BaseService<Course> {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @Inject(forwardRef(() => ProfileService))
    private profileService: ProfileService,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
  ) {
    super(courseRepository, courseRelations);
  }

  async create(createCourseDto: CreateCourseDto, user: UserToken) {
    const { author: authorId, category: categoryId } = createCourseDto;

    const course = await this.findOne({
      author: { id: authorId },
      category: { id: categoryId },
    });

    if (course) {
      BaseError(ModuleName.COURSE, HttpStatus.NOT_FOUND);
    }

    const author = await this.profileService.findOne({ id: authorId });

    if (!author) {
      BaseError(ModuleName.COURSE, HttpStatus.NOT_FOUND);
    }
    const category = await this.categoryService.findOne({ id: categoryId });
    if (!category) {
      BaseError(ModuleName.COURSE, HttpStatus.NOT_FOUND);
    }

    const createCourse = this.courseRepository.create({
      ...createCourseDto,
      author,
      category,
    });

    await this.courseRepository.save(createCourse);
    return {
      course: createCourse,
    };
  }

  async findAll(query: QueryCourseInput) {
    const { search = '', limit = 10 } = query || {};

    const where: FindOptionsWhere<Course> = {
      author: query.authors ? Any([query.authors]) : Not(IsNull()),
      category: query.categorys ? Any([query.categorys]) : Not(IsNull()),
    };

    const { data: courses, total } = await this.find({
      where,
      limit,
    });

    return {
      courses,
      total,
    };
  }

  async findById(id: string) {
    const course = await this.findOne({ id });

    if (!course) {
      BaseError(ModuleName.COURSE, HttpStatus.NOT_FOUND);
    }

    return {
      course,
    };
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, user: UserToken) {
    const course = await this.findOne({ id });

    if (course.author.id !== user.profile.id) {
      BaseError(ModuleName.COURSE, HttpStatus.FORBIDDEN);
    }

    if (!course) {
      BaseError(ModuleName.COURSE, HttpStatus.NOT_FOUND);
    }

    await this.courseRepository.save({
      ...updateCourseDto,
      id: course.id,
    });

    return {
      course: { ...course, ...updateCourseDto },
    };
  }

  async remove(id: string, user: UserToken) {
    const course = await this.findOne({ id });

    if (course.author.id !== user.profile.id) {
      BaseError(ModuleName.COURSE, HttpStatus.FORBIDDEN);
    }

    if (!course) {
      BaseError(ModuleName.COURSE, HttpStatus.NOT_FOUND);
    }

    return {
      course: await this.courseRepository.softRemove(course),
    };
  }
}
