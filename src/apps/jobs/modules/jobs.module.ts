import { forwardRef, Module } from '@nestjs/common';
import { JobsService } from '../services/job/jobs.service';
import { JobsController } from '../controllers/job/jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant, Job, Resume } from '../entities';
import { SettingModule } from 'apps/settings';
import { AddressModule } from 'apps/address';
import { ApplicantController } from '../controllers/applicant';
import { ResumeController } from '../controllers/resume';
import { ApplicantService } from '../services/applicant';
import { ResumeService } from '../services/resume';
import { ProfileModule } from 'apps/profiles';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Applicant, Resume]), 
  forwardRef(() => SettingModule),
  forwardRef(() => AddressModule),
  forwardRef(() => ProfileModule),
],
  controllers: [JobsController, ApplicantController, ResumeController],
  providers: [JobsService, ApplicantService, ResumeService],
  exports: [JobsService, ApplicantService, ResumeService],
})
export class JobsModule {}
