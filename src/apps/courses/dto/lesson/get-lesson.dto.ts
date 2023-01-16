import { ApiProperty } from "@nestjs/swagger";
import { Lesson } from "apps/courses/entities";
import { IsArray } from "class-validator";


export class GetLessonsOutput {
    @IsArray()
    @ApiProperty({ type: () => [Lesson] })
    lessons: Lesson[]
}

export class GetLessonOutput {
    @ApiProperty({ type: () => Lesson })
    lesson?: Lesson
}