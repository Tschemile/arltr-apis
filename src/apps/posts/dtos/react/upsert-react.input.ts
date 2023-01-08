import { ApiProperty } from "@nestjs/swagger";
import { REACT_TYPE } from "apps/posts/constants";
import { IsEnum, IsUUID } from "class-validator";

export class UpsertReactInput {
  @IsUUID()
  @ApiProperty({ type: String, nullable: true })
  post?: string

  @IsUUID()
  @ApiProperty({ type: String, nullable: true })
  comment?: string

  @IsEnum(REACT_TYPE)
  @ApiProperty({ type: String, enum: REACT_TYPE })
  type: string
}