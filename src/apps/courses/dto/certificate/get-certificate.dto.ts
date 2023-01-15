import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Certificate } from "apps/courses/entities";
import { BaseOutputResponse } from "base";
import { IsArray } from "class-validator";


export class GetCertificatesOutput extends BaseOutputResponse {
    @IsArray()
    @ApiProperty({ type: [ Certificate ] })
    certificates: Certificate[]
}

export class GetCertificateOutput extends OmitType(BaseOutputResponse, ['total' as const]) {
    @ApiProperty({ type: Certificate })
    certificate?: Certificate
  }