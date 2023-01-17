import { ApiProperty } from "@nestjs/swagger";
import { POLICY_TYPE } from "apps/settings/constants";
import { BaseQueryInput } from "base";
import { IsEnum } from "class-validator";

export class QueryPolicyInput extends BaseQueryInput {
    @IsEnum(POLICY_TYPE)
    type?: string
}