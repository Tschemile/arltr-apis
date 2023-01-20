import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Product } from "./product.entity";
import { ApiProperty } from "@nestjs/swagger";
import { DBName } from "utils";

@Entity(DBName.REVIEW, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class Review extends Base {
  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  user: Profile

  @Index()
  @ManyToOne(() => Product)
  @ApiProperty({ type: () => Product })
  product: Product

  @Column()
  @ApiProperty({ type: Number })
  rating: number

  @Column()
  @ApiProperty({ type: String })
  comment: string
}