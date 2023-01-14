import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, ManyToOne } from "typeorm";
import { Product } from "./product.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Review extends Base {
  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  user: Profile

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