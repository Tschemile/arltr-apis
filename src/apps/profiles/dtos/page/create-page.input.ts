import { ApiProperty } from "@nestjs/swagger";
import { IsLowercase, IsOptional, IsString, IsUUID } from "class-validator";

export class CreatePageInput {
  @IsString()
  @ApiProperty({ type: String })
  name: string

  @IsLowercase()
  @ApiProperty()
  domain: string

  @IsUUID()
  @IsOptional()
  @ApiProperty({ type: String })
  category?: string
}