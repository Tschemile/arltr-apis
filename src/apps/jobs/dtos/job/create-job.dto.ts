import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';
import { JOB_CAREER, JOB_GENDER, JOB_QUALIFICATION, JOB_TYPE, SALARY_TYPE } from '../../constants';

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
  @IsEnum(JOB_TYPE)
  @IsNotEmpty()
  type = JOB_TYPE.FULL_TIME;

  @ApiProperty({ enum: JOB_GENDER })
  @IsEnum(JOB_GENDER)
  @IsNotEmpty()
  gender = JOB_GENDER.FEMALE;

  @ApiProperty({ enum: SALARY_TYPE })
  @IsEnum(SALARY_TYPE)
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
  @IsEnum(JOB_CAREER)
  @IsNotEmpty()
  career = JOB_CAREER.STUDENT;

  @ApiProperty({ enum: JOB_QUALIFICATION })
  @IsEnum(JOB_QUALIFICATION)
  @IsNotEmpty()
  qualification = JOB_QUALIFICATION.ASSOCIATE_DEGREE;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  expiredAt: Date;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  image: string;
}
