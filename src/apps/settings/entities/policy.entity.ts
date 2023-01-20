import { ApiProperty } from "@nestjs/swagger";
import { Base } from "base";
import { Column, Entity } from "typeorm";
import { DBName } from "utils";
import { POLICY_TYPE } from "../constants";

@Entity(DBName.POLICY, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class Policy extends Base {
  @Column()
  @ApiProperty({ type: String })
  title: string

  @Column()
  @ApiProperty({ type: String })
  content: string

  @Column({ enum: POLICY_TYPE })
  @ApiProperty({ type: String, enum: POLICY_TYPE })
  type: string
}