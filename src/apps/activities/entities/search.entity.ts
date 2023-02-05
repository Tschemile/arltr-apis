import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { DBName } from "utils";

@Entity(DBName.SEARCH, {
  orderBy: {
    createdAt: 'DESC'
  }
})
export class Search extends Base {
  @Index()
  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  user: Profile

  @Column()
  @ApiProperty({ type: String })
  text: string

  @Column({ type: 'json' })
  @ApiProperty({ type: Object })
  result: object
}