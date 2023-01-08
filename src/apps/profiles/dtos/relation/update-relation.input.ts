import { ApiProperty } from "@nestjs/swagger";
import { FRIEND_STATUS } from "apps/profiles/constants";
import { IsEnum } from "class-validator";

export class UpdateRelationInput {
  @IsEnum(FRIEND_STATUS)
  @ApiProperty({ type: String, enum: FRIEND_STATUS })
  status: string
}