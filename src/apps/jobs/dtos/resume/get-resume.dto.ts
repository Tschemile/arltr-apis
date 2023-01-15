import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Job, Resume } from "apps/jobs/entities";
import { BaseOutputResponse } from "base";
import { IsArray } from "class-validator";


export class GetResumesOutput extends BaseOutputResponse {
    @IsArray()
    @ApiProperty({ type: () => [Resume] })
    resumes: Resume[]
}

export class GetResumeOutput extends OmitType(BaseOutputResponse, ['total' as const]) {
    @ApiProperty({ type: () => Resume })
    resume?: Resume
}