import { ApiProperty } from "@nestjs/swagger";
import { Base } from "base";
import { Column, Entity, ManyToOne } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "./product.entity";

@Entity()
export class Item extends Base {
  @ManyToOne(() => Order)
  @ApiProperty({ type: Order })
  order: Order

  @ManyToOne(() => Product)
  @ApiProperty({ type: Product })
  product: Product

  @Column()
  @ApiProperty({ type: Number })
  quantity: number

  @Column()
  @ApiProperty({ type: Number })
  price: number
}