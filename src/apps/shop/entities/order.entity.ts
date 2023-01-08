import { Address } from "apps/address";
import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Order extends Base {
  @ManyToOne(() => Profile)
  @ApiProperty({ type: Profile })
  shop: Profile

  @ManyToOne(() => Profile)
  @ApiProperty({ type: Profile })
  user: Profile

  @Column()
  @ApiProperty({ type: String })
  ticketId: string

  @ManyToOne(() => Address)
  @ApiProperty({ type: Address })
  address: Address

  @Column()
  @ApiProperty({ type: Number })
  taxPrice: number

  @Column()
  @ApiProperty({ type: Number })
  shippingPrice: number

  @Column()
  @ApiProperty({ type: Number })
  totalPrice: number

  @Column({ default: false })
  @ApiProperty({ type: Boolean, default: false })
  isPaid: boolean

  @Column({ nullable: true })
  @ApiProperty({ type: String, format: 'date-time' })
  paidAt: Date

  @Column({ default: false })
  @ApiProperty({ type: Boolean, default: false })
  isDelivered: boolean

  @Column({ nullable: true })
  @ApiProperty({ type: String, format: 'date-time' })
  deliveredAt: Date

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  receipt: string
}