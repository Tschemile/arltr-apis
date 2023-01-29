import { ApiProperty } from "@nestjs/swagger";
import { Category } from "apps/settings";
import { User } from "apps/users";
import { Base } from "base";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { DBName } from "utils";
import { USER_ROLE, USER_STATUS } from "../constants";

@Entity(DBName.PROFILE, {
  orderBy: {
    createdAt: 'DESC',
  }
})
export class Profile extends Base {
  @ManyToOne(() => User)
  user: User

  @Column()
  @ApiProperty({ type: String })
  name: string

  @Index()
  @Column({ unique: true })
  @ApiProperty({ type: String })
  domain: string

  @ManyToOne(() => Category, { nullable: true })
  category: Category

  @Column()
  @ApiProperty({ type: String, format: 'date-time' })
  birth: Date

  @Column()
  @ApiProperty({ type: String })
  gender: string

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  avatar: string

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  cover: string

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  about: string

  @Column({ nullable: true })
  @ApiProperty({ type: String })
  work: string

  @Column({ type: 'simple-array', nullable: true })
  @ApiProperty({ type: [String] })
  socialLinks: string[]

  @Column({ type: 'simple-array', nullable: true })
  @ApiProperty({ type: [String] })
  hobbies: string[]

  @Column({ enum: USER_STATUS, default: USER_STATUS.NONE })
  @ApiProperty({ type: String, enum: USER_STATUS })
  status: string

  @Column({ enum: USER_ROLE, default: USER_ROLE.USER })
  @ApiProperty({ type: String, enum: USER_ROLE })
  role: string
}
