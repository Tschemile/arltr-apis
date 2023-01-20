import { OmitType } from "@nestjs/swagger";
import { CreateResumeDto } from "./create-resume.dto";

export class UpdateResumeDto extends OmitType(CreateResumeDto, ['candidate'] as const) {}