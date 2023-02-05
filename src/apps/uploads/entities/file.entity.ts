import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { DBName } from "utils";
import { FILE_SCOPE } from "../constants";
import { Album } from "./album.entity";

@Entity(DBName.FILE, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class File extends Base {
  @ManyToOne(() => Profile)
  @ApiProperty({ type: () => Profile })
  owner: Profile

  @ManyToOne(() => Album, { nullable: true })
  @ApiProperty({ type: () => Album })
  album: Album
  
  @Index()
  @Column({ unique: true })
  @ApiProperty({ type: String })
  filename: string

  @Column()
  @ApiProperty({ type: String })
  path: string

  @Column()
  @ApiProperty({ type: String })
  mimetype: string

  @Column()
  @ApiProperty({ type: Number })
  size: number

  @Column({ enum: FILE_SCOPE, default: FILE_SCOPE.PUBLIC })
  @ApiProperty({ type: String })
  scope: string

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  url: string
}