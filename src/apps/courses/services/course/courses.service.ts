import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'apps/auth';
import { UpdateCourseDto } from 'apps/courses/dto';
import { QueryCourseInput } from 'apps/courses/dto/course/query-course.dto';
import { ProfileService } from 'apps/profiles';
import { CategoryService } from 'apps/settings';
import { BaseService } from 'base';
import { Any, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { HTTP_STATUS } from 'utils';
import { CreateCourseDto } from '../../dto/course/create-course.dto';
import { Course } from '../../entities';

const relations = {
  author: true,
  category: true,
}

@Injectable()
export class CourseService extends BaseService<Course> {

  constructor( @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService,
    @Inject(forwardRef(() => CategoryService)) private categoryService: CategoryService,

  ) {
    super(courseRepository)
  }

  async create(createCourseDto: CreateCourseDto, user: UserToken) {
    const { author: authorId, category: categoryId } = createCourseDto;

    const course = await this.findOne({ author: { id : authorId}, category: { id: categoryId }});

    if(course) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    }

    const author = await this.profileService.findOne({ id: authorId });

      if(!author) {
        return {
          status: HTTP_STATUS.Not_Found
        }
      }
    const category = await this.categoryService.findOne({ id: categoryId });
    if(!category) {
      return {
        status: HTTP_STATUS.Not_Found
      }
    }

    const createCourse = this.courseRepository.create({
      ...createCourseDto,
      author,
      category,
    })

    await this.courseRepository.save(createCourse);
    return {
      status: HTTP_STATUS.OK,
      course: createCourse,
    }
  }

  async findAll(query: QueryCourseInput) {
    const { search = '', limit: take = 10 } = query || {};

    const where: FindOptionsWhere<Course> = {
      author: query.authors ? Any([query.authors]) : Not(IsNull()),
      category: query.categorys ? Any([query.categorys]) : Not(IsNull()),
    }

    const result = await this.courseRepository.findAndCount({
      where,
      relations,
      take,
    })

    const itemCount = result[1];
    return {
      courses: result[0],
      total: itemCount,
    };
  }

  async findById(id: string) {
    const course = await this.findOne({ id });

    if(!course) {
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }

    return {
      status: HTTP_STATUS.OK,
      course,
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, user: UserToken) {
    const course = await this.findOne({ id });

    if(course.author.id !== user.profile.id) {
      return {
        status: HTTP_STATUS.Forbidden,
      }
    }

    if(!course) {
      return {
        status: HTTP_STATUS.Not_Found,
      }
    }
    
    await this.courseRepository.save({
      ...updateCourseDto,
      id: course.id
    });

    return {
      status: HTTP_STATUS.OK,
      course: { ...course, ...updateCourseDto}
    }

  }

   async remove(id: string, user: UserToken) {
    const course = await this.findOne({ id }, relations);

    if(course.author.id !== user.profile.id) {
      return {
        status: HTTP_STATUS.Forbidden,
      }
    }

    if(!course) {
      return {
        status: HTTP_STATUS.Not_Found,
      }
    } 

     await this.courseRepository.softRemove(course);

    return {
      status: HTTP_STATUS.OK,
    }
  }
}
