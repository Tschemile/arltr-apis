import { OmitType } from "@nestjs/swagger";
import { BaseOutputResponse } from "base";

export class UpdateResumeDto extends OmitType(BaseOutputResponse, ['total'] as const) {}