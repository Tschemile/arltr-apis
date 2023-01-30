import { ApiProperty } from "@nestjs/swagger";
import { Responded } from "apps/address/entities";
import { IsArray } from "class-validator";


export class GetListRespondersOutput{
    @IsArray()
    @ApiProperty({ type: () => [Responded] })
    listResponse: Responded[]
}

export class GetRespondedOutput  {
    @ApiProperty({ type: () => Responded })
    responded?: Responded
}