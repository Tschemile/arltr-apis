import { forwardRef, Module } from '@nestjs/common';
import { JobsService } from '../services/job/jobs.service';
import { JobsController } from '../controllers/job/jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant, Job, Resume } from '../entities';
import { SettingModule } from 'apps/settings';
import { Address, AddressModule } from 'apps/address';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Applicant, Resume]), 
  forwardRef(() => SettingModule),
  forwardRef(() => AddressModule)
],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
