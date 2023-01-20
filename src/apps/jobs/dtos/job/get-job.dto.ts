import { ApiProperty } from "@nestjs/swagger";
import { Job } from "apps/jobs/entities";
import { IsArray } from "class-validator";


export class GetJobsOutput{
    @IsArray()
    @ApiProperty({ type: () => [Job] })
    jobs: Job[]
}

export class GetJobOutput  {
    @ApiProperty({ type: () => Job })
    job?: Job
}