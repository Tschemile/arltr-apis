import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateLessonDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    order: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    question:string;

    @ApiProperty({ type: [String], required: false })
    @IsString()
    @IsNotEmpty()
    answers: string[];

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    right: number;

    @ApiProperty({ required: true })
    @IsUUID()
    @IsNotEmpty()
    course: string;
}