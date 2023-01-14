import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Course, Lesson } from "apps/courses/entities";
import { BaseOutputResponse } from "base";
import { IsArray } from "class-validator";


export class GetLessonsOutput extends BaseOutputResponse {
    @IsArray()
    @ApiProperty({ type: [ Lesson ] })
    lessons: Lesson[]
}

export class GetLessonOutput extends OmitType(BaseOutputResponse, ['total' as const]) {
    @ApiProperty({ type: Lesson })
    lesson?: Lesson
  }