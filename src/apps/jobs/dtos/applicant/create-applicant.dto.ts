import { ApiProperty } from "@nestjs/swagger";
import { APPLICANT_STATUS } from "apps/jobs/constants";
import { IsDateString, IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateApplicantDto {
  @ApiProperty({ enum: APPLICANT_STATUS })
  @IsEnum(APPLICANT_STATUS)
  @IsNotEmpty()
  status = APPLICANT_STATUS.PENDING;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  job: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  resume: string;

}