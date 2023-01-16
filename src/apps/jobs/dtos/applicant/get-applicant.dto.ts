import { ApiProperty } from "@nestjs/swagger";
import { Applicant } from "apps/jobs/entities";
import { IsArray } from "class-validator";

export class GetApplicantsOutput {
    @IsArray()
    @ApiProperty({ type: () => [ Applicant] })
    applicants: Applicant[]
}

export class GetApplicantOutput {
    @ApiProperty({ type: () => Applicant })
    applicant?: Applicant 
}