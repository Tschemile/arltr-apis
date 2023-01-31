import { PartialType } from "@nestjs/swagger";
import { CreateRespondedDto } from "./create-responded.dto";

export class UpdateRespondedDto extends PartialType(CreateRespondedDto){}