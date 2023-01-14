import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateCertificateDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    process: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    badge: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    duration: string;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsNotEmpty()
    blocked: boolean;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    course: string;
}