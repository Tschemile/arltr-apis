import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Resume extends Base {
  @ManyToOne(() => Profile, {
    cascade: true,
  })
  candidate: Profile

  @Column()
  @ApiProperty({ type: String })
  name: string

  @Column()
  @ApiProperty({ type: String })
  cv: string
}