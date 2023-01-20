import { ApiProperty } from "@nestjs/swagger";
import { Report } from "apps/settings/entities";
import { IsArray } from "class-validator";

export class GetReportsOutput {
    @IsArray()
    @ApiProperty({ type: () => [ Report] })
    reports: Report[];
}