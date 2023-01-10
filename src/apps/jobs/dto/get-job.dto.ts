import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Item, Order } from "apps/shop/entities";
import { BaseOutputResponse } from "base";
import { IsArray } from "class-validator";
import { Job } from "../entities";


export class GetJobsOutput extends BaseOutputResponse {
    @IsArray()
    @ApiProperty({ type: [Job ] })
    jobs: Job[]
}

export class GetJobOutput extends OmitType(BaseOutputResponse, ['total' as const]) {
    @ApiProperty({ type: Job })
    job?: Job
  }