import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { FILE_SCOPE } from "../constants";

@Entity()
export class Album extends Base {
  @Index()
  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  user: Profile

  @Column()
  @ApiProperty({ type: String })
  name: string

  @Column({ enum: FILE_SCOPE, default: FILE_SCOPE.PUBLIC })
  @ApiProperty({ type: String })
  mode: string

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  presentation: string
}

