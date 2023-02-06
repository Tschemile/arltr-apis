import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'base';
import { Column, Entity } from 'typeorm';
import { DBName } from 'utils';

@Entity(DBName.VERIFY, {
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Verify extends Base {
  @Column({ nullable: true })
  @ApiProperty({ type: String })
  code: string;

  @Column()
  @ApiProperty({ type: String })
  information: string;

  @Column()
  @ApiProperty({ type: String, format: 'date-time' })
  expiredAt: Date;
}
