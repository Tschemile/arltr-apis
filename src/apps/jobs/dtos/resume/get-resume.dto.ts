import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Job, Resume } from "apps/jobs/entities";
import { BaseOutputResponse } from "base";
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