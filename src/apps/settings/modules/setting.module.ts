import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from 'apps/courses';
import { ForumModule } from 'apps/forum';
import { GroupModule } from 'apps/groups';
import { JobsModule } from 'apps/jobs';
import { PostModule } from 'apps/posts';
import { ProfileModule } from 'apps/profiles';
import { ShopModule } from 'apps/shop';
import { CategoryController, PolicyController, ReportController } from '../controllers';
import { Category, Policy, Report } from '../entities';
import { CategoryService, PolicyService, ReportService } from '../services';


@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Policy, Report]),
    forwardRef(() => ProfileModule),
    forwardRef(() => PostModule),
    forwardRef(() => ForumModule),
    forwardRef(() => ShopModule),
    forwardRef(() => ProfileModule),
    forwardRef(() => GroupModule),
    forwardRef(() => JobsModule),
    forwardRef(() => CoursesModule),
  ],
  controllers: [CategoryController, PolicyController, ReportController],
  providers: [CategoryService, PolicyService, ReportService],
  exports: [CategoryService, PolicyService, ReportService],
})
export class SettingModule {}
