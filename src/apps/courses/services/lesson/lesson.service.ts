import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateLessonDto } from "apps/courses/dto/lesson/create-lesson.dto";
import { QueryLessonInput } from "apps/courses/dto/lesson/query-lesson.dto";
import { UpdateLessonDto } from "apps/courses/dto/lesson/update-lesson.dto";
import { Lesson } from "apps/courses/entities";
import { BaseService } from "base";
import { Any, FindOptionsWhere, IsNull, Like, Not, Repository } from "typeorm";
import { HTTP_STATUS } from "utils";
import { CourseService } from "../course";

const relations = {
    course: true,
}

@Injectable()
export class LessonService extends BaseService<Lesson> {
    constructor(
        @InjectRepository(Lesson)
        private lessonRepository: Repository<Lesson>,
        @Inject(forwardRef(() => CourseService)) private courseService: CourseService,
    ) {
        super(lessonRepository)
    }

    async create(createLessonDto: CreateLessonDto) {
        const course = await this.courseService.findOne({ id: createLessonDto.course });

        if(!course) {
            return {
                status: HTTP_STATUS.Not_Found
            }
        }

        const createLesson = this.lessonRepository.create({
            ...createLessonDto,
            course,
        });

        await this.lessonRepository.save(createLesson);
        return {
            status: HTTP_STATUS.OK,
            lesson: createLesson,
        }
    }

    async findAll(query: QueryLessonInput) {
        const {
            search = '', limit: take = 10,
        } = query || {}

        const where: FindOptionsWhere<Lesson> = {
            course : query.courses ? Any([query.courses]) : Not(IsNull),
            name: search ? Like(`%${search}%`) : Not(IsNull())
        }

        const result = await this.lessonRepository.findAndCount({
            relations,
            where,
            take,
        });

        const itemCount = result[1];
        return {
          lessons: result[0],
          total: itemCount,
        };
    }

    async findById(id: string) {
        const lesson = await this.findOne({ id });

        if(!lesson) {
            return {
                status: HTTP_STATUS.Not_Found
            }
        } 

        return {
            status: HTTP_STATUS.OK,
            lesson,
        }
    }

    async update(id: string, updateLessonDto: UpdateLessonDto) {

        const lesson = await this.findOne({ id });
        
        if(!lesson) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }

        const course = await this.courseService.findOne({ id: updateLessonDto.course });

        if(!course) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }

        await this.lessonRepository.save({
            ...updateLessonDto,
            id: course.id,
            course,  
        });

        return {
            status: HTTP_STATUS.OK,
            lesson: {...lesson, ...updateLessonDto},
        }
    }

    async remove(id: string) {
        const lesson = await this.findOne({ id }, relations);
        
        if(!lesson) {
            return {
                status: HTTP_STATUS.Not_Found,
            }
        }

        await this.lessonRepository.softRemove(lesson);

        return {
            status: HTTP_STATUS.OK,
        }
    }
}