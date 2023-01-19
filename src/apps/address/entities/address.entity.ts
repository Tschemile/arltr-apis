import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";

@Entity()
export class Address extends Base {
  @Index()
  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  user: Profile
  
  @Column()
  @ApiProperty({ type: String })
  address: string

  @Column()
  @ApiProperty({ type: String })
  city: string

  @Column()
  @ApiProperty({ type: String })
  state: string

  @Column()
  @ApiProperty({ type: String })
  country: string

  @Column()
  @ApiProperty({ type: Number })
  lat: number

  @Column()
  @ApiProperty({ type: Number })
  long: number
}
