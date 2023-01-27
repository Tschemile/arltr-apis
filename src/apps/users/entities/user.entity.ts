import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, Index, OneToMany } from "typeorm";
import { DBName } from "utils";

@Entity(DBName.USER, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class User extends Base {
  @OneToMany(() => Profile, profile => profile.user, {
    cascade: true,
  })
  @ApiProperty({ type: () => Profile })
  profiles: Profile[]

  @Column()
  @ApiProperty({ type: String })
  firstName: string

  @Column()
  @ApiProperty({ type: String })
  lastName: string

  @Index()
  @Column({ unique: true })
  @ApiProperty({ type: String })
  username: string

  @Column({ unique: true })
  @ApiProperty({ type: String })
  email: string

  @Column({ select: false })
  @ApiProperty({ type: String })
  password: string
}
