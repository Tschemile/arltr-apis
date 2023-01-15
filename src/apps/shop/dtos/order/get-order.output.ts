import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Item, Order } from "apps/shop/entities";
import { BaseOutputResponse } from "base";

export class OrderOutput extends Order {
  orderItems?: Item[]
}

export class GetOrdersOutput {
  @ApiProperty({ type: () => [Order] })
  orders: Order[]
}

export class GetOrderOutput {
  @ApiProperty({ type: () => Order })
  order?: OrderOutput
}