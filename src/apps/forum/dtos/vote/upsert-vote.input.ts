import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsUUID } from "class-validator";

export class UpsertVoteInput {
  @IsUUID()
  @ApiProperty({ type: String })
  blog?: string

  @IsUUID()
  @ApiProperty({ type: String })
  reply?: string

  @IsBoolean()
  @ApiProperty({ type: Boolean })
  vote: boolean
}