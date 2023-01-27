import { ApiProperty } from '@nestjs/swagger';
import { EVENT_MODE, EVENT_TYPE } from 'apps/address/constants';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ enum: EVENT_TYPE })
  @IsEnum(EVENT_TYPE)
  @IsNotEmpty()
  type = EVENT_TYPE.OFFLINE;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @ApiProperty({ enum: EVENT_MODE })
  @IsEnum(EVENT_MODE)
  @IsNotEmpty()
  mode = EVENT_MODE.PUBLIC;

  @ApiProperty({ type: String })
  @IsString()
  about: string

  @ApiProperty({ type: Number })
  @IsNumber()
  totalResponded: number

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  address: string

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  group: string

}
