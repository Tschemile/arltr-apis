import { ApiProperty } from "@nestjs/swagger";
import { FRIEND_STATUS, RELATION_ACTION, RELATION_TYPE } from "apps/profiles/constants";
import { IsEnum, IsOptional, IsUUID } from "class-validator";

export class UpsertRelationInput {

  @IsUUID()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  user?: string

  @IsEnum(RELATION_TYPE)
  @ApiProperty({ type: String, enum: RELATION_TYPE })
  type?: string

  @IsEnum(FRIEND_STATUS)
  @ApiProperty({ type: String, enum: FRIEND_STATUS })
  status: string


}