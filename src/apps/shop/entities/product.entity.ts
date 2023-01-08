import { Address } from "apps/address";
import { Base } from "base";
import { Category } from "apps/settings";
import { Profile } from "apps/profiles";
import { Column, Entity, ManyToOne } from "typeorm";
import { PRODUCT_STATUS } from "../constants";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Product extends Base {
  @ManyToOne(() => Profile)
  @ApiProperty({ type: Profile })
  shop: Profile

  @Column()
  @ApiProperty({ type: String })
  name: string

  @ManyToOne(() => Address)
  @ApiProperty({ type: Address })
  address: Address

  @Column()
  @ApiProperty({ type: Number })
  price: number

  @Column({ type: 'simple-array' })
  @ApiProperty({ type: [String] })
  images: string[]

  @Column()
  @ApiProperty({ type: String })
  description: string

  @ManyToOne(() => Category)
  @ApiProperty({ type: Category })
  category: Category

  @Column({ type: 'simple-array' })
  @ApiProperty({ type: [String] })
  tags: string[]

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  countInStock: number

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  rating: number

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  numReviews: number

  @Column({ enum: PRODUCT_STATUS })
  @ApiProperty({ type: String, enum: PRODUCT_STATUS })
  status: string

  @Column({ unique: true })
  @ApiProperty({ type: String })
  slug: string
}