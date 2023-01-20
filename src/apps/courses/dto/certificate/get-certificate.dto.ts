import { ApiProperty } from "@nestjs/swagger";
import { Certificate } from "apps/courses/entities";
import { IsArray } from "class-validator";


export class GetCertificatesOutput {
    @IsArray()
    @ApiProperty({ type: () => [Certificate] })
    certificates: Certificate[]
}

export class GetCertificateOutput {
    @ApiProperty({ type: () => Certificate })
    certificate?: Certificate
}