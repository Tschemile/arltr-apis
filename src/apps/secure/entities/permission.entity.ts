import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "apps/profiles";
import { Base } from "base";
import { Column, Entity, ManyToOne } from "typeorm";
import { DBName, ModuleName } from "utils";

@Entity(DBName.PERMISSION, {
  orderBy: {
    createdAt: 'DESC'
  }
})
export class Permission extends Base {
  @ManyToOne(() => Profile)
  user: Profile 
  
  @Column()
  @ApiProperty({ type: String })
  name: string

  @Column({ enum: ModuleName})
  @ApiProperty({ type: String, enum: ModuleName })
  module: string

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  action: number
}