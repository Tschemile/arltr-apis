import { ApiProperty } from "@nestjs/swagger";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { DBName } from "utils";
import { Order } from "./order.entity";
import { Product } from "./product.entity";

@Entity(DBName.ITEM, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class Item extends Base {
  @Index()
  @ManyToOne(() => Order)
  @ApiProperty({ type: () => Order })
  order: Order

  @ManyToOne(() => Product)
  @ApiProperty({ type: () => Product })
  product: Product

  @Column()
  @ApiProperty({ type: Number })
  quantity: number

  @Column()
  @ApiProperty({ type: Number })
  price: number
}