import { ApiProperty } from "@nestjs/swagger";
import { RELATION_TYPE } from "apps/profiles/constants";
import { IsEnum, IsUUID } from "class-validator";

export class CreateRelationInput {
  @IsUUID()
  @ApiProperty({ type: String })
  user: string

  @IsEnum(RELATION_TYPE)
  @ApiProperty({ type: String, enum: RELATION_TYPE })
  type: string
}