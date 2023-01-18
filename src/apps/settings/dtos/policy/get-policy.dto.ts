import { ApiProperty } from "@nestjs/swagger";
import { Policy } from "apps/settings/entities";
import { IsArray } from "class-validator";

export class GetPolicysOutput {
    @IsArray()
    @ApiProperty({ type: () => [Policy] })
    policys: Policy[]
}
