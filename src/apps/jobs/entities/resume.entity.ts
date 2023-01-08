import { Base } from "base";
import { Profile } from "apps/profiles";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Resume extends Base {
  @ManyToOne(() => Profile)
  candidate: Profile

  @Column()
  name: string

  @Column()
  cv: string
}