import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReportDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsUUID()
  user?: string;

  @ApiProperty()
  @IsUUID()
  post?: string;

  @ApiProperty()
  @IsUUID()
  comment?: string;

  @ApiProperty()
  @IsUUID()
  blog?: string;

  @ApiProperty()
  @IsUUID()
  reply?: string;

  @ApiProperty()
  @IsUUID()
  product?: string;

  @ApiProperty()
  @IsUUID()
  group?: string;

  @ApiProperty()
  @IsUUID()
  job?: string;

  @ApiProperty()
  @IsUUID()
  course?: string;
}
