import { ApiProperty } from "@nestjs/swagger";
import { Base } from "base";
import { Column, Entity } from "typeorm";
import { DBName } from "utils";
import { CATEGORY_MODULE, CATEGORY_STATUS } from "../constants";

@Entity(DBName.CATEGORY, {
  orderBy: {
    createdAt: 'DESC',
  }
})export class Category extends Base {
  @Column()
  @ApiProperty({ type: String })
  name: string

  @Column()
  @ApiProperty({ type: String })
  image: string

  @Column({ enum: CATEGORY_STATUS, default: CATEGORY_STATUS.ACTIVE })
  @ApiProperty({ type: String, enum: CATEGORY_STATUS })
  status: string

  @Column({ enum: CATEGORY_MODULE, default: CATEGORY_MODULE.ALL })
  @ApiProperty({ type: String, enum: CATEGORY_MODULE })
  module: string
}