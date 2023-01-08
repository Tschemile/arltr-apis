import { ApiProperty } from "@nestjs/swagger";
import { Base } from "base";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends Base {
  @Column()
  @ApiProperty({ type: String })
  firstName: string

  @Column()
  @ApiProperty({ type: String })
  lastName: string

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
