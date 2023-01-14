import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateCourseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    lessons: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    time: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    participants: number;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    author: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    category: string;

}
