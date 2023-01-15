import { ApiProperty } from "@nestjs/swagger";
import { Address } from "apps/address/entities";

export class GetAddressesOutput {
  @ApiProperty({ type: () => [Address] })
  addresses: Address[]

  @ApiProperty({ type: Number })
  total: number
}

export class GetAddressOutput {
  @ApiProperty({ type: () => Address })
  address: Address
}