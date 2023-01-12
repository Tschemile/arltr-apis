import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, IsUUID } from "class-validator";

export class CreateResumeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    candidate: string;

    @ApiProperty()
    @IsUrl()
    @IsNotEmpty()
    cv: string;
}