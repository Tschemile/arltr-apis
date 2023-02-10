import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsNotEmpty, IsUUID } from "class-validator";

export class CreateRoleInput {
  @IsAlpha()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  name: string

  @IsUUID(4, { each: true })
  @ApiProperty({ type: [String] })
  permissions: string[]
}