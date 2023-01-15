import { forwardRef, Module } from '@nestjs/common';
import { CourseService } from '../services/course/courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate, Course, Lesson } from '../entities';
import { SettingModule } from 'apps/settings';
import { AddressModule } from 'apps/address';
import { ProfileModule } from 'apps/profiles';
import { CertificateController, CourseController, LessonController } from '../controllers';
import { CertificateService, LessonService } from '../services';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Course, Lesson, Certificate ]),
    forwardRef(() => AddressModule),
    forwardRef(() => ProfileModule),
    forwardRef(() => SettingModule),
  ],
  controllers: [CourseController, LessonController, CertificateController],
  providers: [CourseService, LessonService, CertificateService],
  exports: [CourseService, LessonService, CertificateService],
})
export class CoursesModule {}
