import { ApiProperty } from "@nestjs/swagger";
import { RELATION_ACTION, RELATION_TYPE } from "apps/profiles/constants";
import { IsEnum, IsOptional, IsUUID } from "class-validator";

export class UpsertRelationInput {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  relation?: string

  @IsUUID()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  user?: string

  @IsEnum(RELATION_TYPE)
  @ApiProperty({ type: String, enum: RELATION_TYPE })
  type?: string

  @IsEnum(RELATION_ACTION)
  @ApiProperty({ type: String, enum: RELATION_ACTION })
  action: string

}