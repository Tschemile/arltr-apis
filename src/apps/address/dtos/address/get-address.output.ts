import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Address } from "apps/address/entities";
import { BaseOutputResponse } from "base";

export class GetAddressesOutput extends BaseOutputResponse {
  @ApiProperty({ type: [Address] })
  addresses: Address[]
}

export class GetAddressOutput extends OmitType(BaseOutputResponse, ['total'] as const) {
  @ApiProperty({ type: Address })
  address?: Address
}