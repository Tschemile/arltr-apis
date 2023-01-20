import { ApiProperty } from "@nestjs/swagger";
import { Resume } from "apps/jobs/entities";
import { IsArray } from "class-validator";


export class GetResumesOutput {
    @IsArray()
    @ApiProperty({ type: () => [Resume] })
    resumes: Resume[]
}

export class GetResumeOutput  {
    @ApiProperty({ type: () => Resume })
    resume?: Resume
}