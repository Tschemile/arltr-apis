import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Job } from "apps/jobs/entities";
import { BaseOutputResponse } from "base";
import { IsArray } from "class-validator";


export class GetJobsOutput extends BaseOutputResponse {
    @IsArray()
    @ApiProperty({ type: () => [Job] })
    jobs: Job[]
}

export class GetJobOutput extends OmitType(BaseOutputResponse, ['total' as const]) {
    @ApiProperty({ type: () => Job })
    job?: Job
}