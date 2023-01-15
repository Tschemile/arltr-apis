import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Course } from "apps/courses/entities";
import { BaseOutputResponse } from "base";
import { IsArray } from "class-validator";


export class GetCoursesOutput extends BaseOutputResponse {
    @IsArray()
    @ApiProperty({ type: [ Course ] })
    courses: Course[]
}

export class GetCourseOutput extends OmitType(BaseOutputResponse, ['total' as const]) {
    @ApiProperty({ type: Course })
    course?: Course
  }