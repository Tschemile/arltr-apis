import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsUUID } from "class-validator";

export class UpsertVoteInput {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ type: String })
  blog?: string

  @IsUUID()
  @IsOptional()
  @ApiProperty({ type: String })
  reply?: string

  @IsBoolean()
  @ApiProperty({ type: Boolean })
  vote: boolean
}