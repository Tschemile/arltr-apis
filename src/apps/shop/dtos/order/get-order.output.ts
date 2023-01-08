import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Item, Order } from "apps/shop/entities";
import { BaseOutputResponse } from "base";

export class OrderOutput extends Order {
  orderItems?: Item[]
}

export class GetOrdersOutput extends BaseOutputResponse {
  @ApiProperty({ type: [Order] })
  orders: Order[]
}

export class GetOrderOutput extends OmitType(BaseOutputResponse, ['total'] as const) {
  @ApiProperty({ type: Order })
  order?: OrderOutput
}