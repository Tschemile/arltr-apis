import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from 'apps/profiles';
import { CategoryController } from '../controllers';
import { Category } from '../entities';
import { CategoryService } from '../services';


@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => ProfileModule)
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class SettingModule {}
