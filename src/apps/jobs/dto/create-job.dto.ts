import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { JOB_CAREER, JOB_GENDER, JOB_QUALIFICATION, JOB_TYPE, SALARY_TYPE } from '../constants';

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: JOB_TYPE })
  @IsString()
  @IsNotEmpty()
  type = JOB_TYPE.FULL_TIME;

  @ApiProperty({ enum: JOB_GENDER })
  @IsString()
  @IsNotEmpty()
  gender = JOB_GENDER.FEMALE;

  @ApiProperty({ enum: SALARY_TYPE })
  @IsString()
  @IsNotEmpty()
  salaryType = SALARY_TYPE.MONTHLY;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  minSalary: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maxSalary: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  experience: string;

  @ApiProperty({ enum: JOB_CAREER })
  @IsString()
  @IsNotEmpty()
  career = JOB_CAREER.STUDENT;

  @ApiProperty({ enum: JOB_QUALIFICATION })
  @IsString()
  @IsNotEmpty()
  qualification = JOB_QUALIFICATION.ASSOCIATE_DEGREE;

  @ApiProperty()
  @IsNotEmpty()
  expiredAt: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string;
}
