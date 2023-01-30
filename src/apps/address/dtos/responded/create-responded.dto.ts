import { ApiProperty } from "@nestjs/swagger";
import { RESPONDED_TYPE } from "apps/address/constants";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";

export class CreateRespondedDto {
    @ApiProperty()
    @IsUUID()
    user: string

    @ApiProperty()
    @IsUUID()
    event: string

    @ApiProperty({ enum: RESPONDED_TYPE })
    @IsEnum(RESPONDED_TYPE)
    @IsNotEmpty()
    type = RESPONDED_TYPE.GOING;

}