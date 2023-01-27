import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryInput } from 'base';
import { IsOptional, IsUUID } from 'class-validator';

export class QueryReportInput extends BaseQueryInput {
  @IsOptional()
  @IsUUID()
  @ApiProperty({ type: [String], required: false })
  reporters: string[];

  @IsOptional()
  @IsUUID()
  @ApiProperty({ type: [String], required: false })
  categorys: string[];

  @IsOptional()
  @IsUUID()
  @ApiProperty({ type: [String], required: false })
  posts?: string[];

  @IsOptional()
  @IsUUID()
  @ApiProperty({ type: [String], required: false })
  blogs?: string[];

  @IsOptional()
  @IsUUID()
  @ApiProperty({ type: [String], required: false })
  products?: string[];

  @IsOptional()
  @IsUUID()
  @ApiProperty({ type: [String], required: false })
  groups?: string[];

  @IsOptional()
  @IsUUID()
  @ApiProperty({ type: [String], required: false })
  jobs?: string[];

  @IsOptional()
  @IsUUID()
  @ApiProperty({ type: [String], required: false })
  courses?: string[];
}
