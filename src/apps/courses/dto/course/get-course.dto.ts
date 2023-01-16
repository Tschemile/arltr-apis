import { ApiProperty } from "@nestjs/swagger";
import { Course } from "apps/courses/entities";
import { IsArray } from "class-validator";


export class GetCoursesOutput {
    @IsArray()
    @ApiProperty({ type: () => [Course] })
    courses: Course[]
}

export class GetCourseOutput {
    @ApiProperty({ type: () => Course })
    course?: Course
}