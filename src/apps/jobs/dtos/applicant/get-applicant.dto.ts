import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Applicant } from "apps/jobs/entities";
import { BaseOutputResponse } from "base";
import { IsArray } from "class-validator";

export class GetApplicantsOutput extends BaseOutputResponse {
    @IsArray()
    @ApiProperty({ type: [ Applicant] })
    applicants: Applicant[]
}

export class GetApplicantOutput extends OmitType(BaseOutputResponse, ['total' as const]) {
    @ApiProperty({ type: Applicant })
    applicant?: Applicant 
}