import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Resume extends Base {
  @Index()
  @ManyToOne(() => Profile, { cascade: true })
  @ApiProperty({ type: () => Profile })
  candidate: Profile

  @Column()
  @ApiProperty({ type: String })
  name: string

  @Column()
  @ApiProperty({ type: String })
  cv: string
}