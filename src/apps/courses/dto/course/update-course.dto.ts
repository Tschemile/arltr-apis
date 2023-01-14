import { OmitType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends OmitType(CreateCourseDto, ['author', 'category'] as const ) {}
