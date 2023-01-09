import { forwardRef, Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant, Job, Resume } from './entities';
import { Category, SettingModule } from 'apps/settings';
import { UserModule } from 'apps/users';
import { AuthModule } from 'apps/auth';
import { Address, AddressModule } from 'apps/address';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Applicant, Resume, Address]), 
  forwardRef(() => UserModule), 
  forwardRef(() => AuthModule),
  forwardRef(() => SettingModule),
  forwardRef(() => AddressModule)
],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
