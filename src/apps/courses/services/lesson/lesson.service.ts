import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLessonDto } from 'apps/courses/dto/lesson/create-lesson.dto';
import { QueryLessonInput } from 'apps/courses/dto/lesson/query-lesson.dto';
import { UpdateLessonDto } from 'apps/courses/dto/lesson/update-lesson.dto';
import { Lesson } from 'apps/courses/entities';
import { BaseError, BaseService } from 'base';
import { Any, FindOptionsWhere, IsNull, Like, Not, Repository } from 'typeorm';
import { ModuleName } from 'utils';
import { CourseService } from '../course';

const lessonRelations = {
  course: true,
};

@Injectable()
export class LessonService extends BaseService<Lesson> {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @Inject(forwardRef(() => CourseService))
    private courseService: CourseService,
  ) {
    super(lessonRepository, lessonRelations);
  }

  async create(createLessonDto: CreateLessonDto) {
    const course = await this.courseService.findOne({
      id: createLessonDto.course,
    });

    if (!course) {
      BaseError(ModuleName.COURSE, HttpStatus.NOT_FOUND);
    }

    const createLesson = this.lessonRepository.create({
      ...createLessonDto,
      course,
    });

    await this.lessonRepository.save(createLesson);
    return {
      lesson: createLesson,
    };
  }

  async findAll(query: QueryLessonInput) {
    const { search = '', limit = 10 } = query || {};

    const where: FindOptionsWhere<Lesson> = {
      course: query.courses ? Any([query.courses]) : Not(IsNull),
      name: search ? Like(`%${search}%`) : Not(IsNull()),
    };

    const { data: lessons, total } = await this.find({
      where,
      limit,
    });

    return {
      lessons,
      total,
    };
  }

  async findById(id: string) {
    const lesson = await this.findOne({ id });

    if (!lesson) {
      BaseError(ModuleName.COURSE, HttpStatus.NOT_FOUND);
    }

    return {
      lesson,
    };
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.findOne({ id });

    if (!lesson) {
      BaseError(ModuleName.COURSE, HttpStatus.NOT_FOUND);
    }

    const course = await this.courseService.findOne({
      id: updateLessonDto.course,
    });

    if (!course) {
      BaseError(ModuleName.COURSE, HttpStatus.NOT_FOUND);
    }

    await this.lessonRepository.save({
      ...updateLessonDto,
      id: course.id,
      course,
    });

    return {
      lesson: { ...lesson, ...updateLessonDto },
    };
  }

  async remove(id: string) {
    const lesson = await this.findOne({ id });

    if (!lesson) {
      BaseError(ModuleName.COURSE, HttpStatus.NOT_FOUND);
    }

    return {
      lesson: await this.lessonRepository.softRemove(lesson),
    };
  }
}
