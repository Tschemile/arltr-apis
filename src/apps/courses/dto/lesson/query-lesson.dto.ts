import { ApiProperty } from "@nestjs/swagger";
import { BaseQueryInput } from "base";
import { IsOptional } from "class-validator";

export class QueryLessonInput extends BaseQueryInput {
    @IsOptional()
    @ApiProperty({ type: [String] })
    courses: string[];

    @IsOptional()
    @ApiProperty()
    search?: string
}