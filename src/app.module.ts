import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AddressModule,
  AuthModule,
  ForumModule,
  GroupModule,
  JobsModule,
  PostModule,
  ProfileModule,
  SettingModule,
  ShopModule,
  UploadModule,
  UserModule
} from 'apps';
import { CoursesModule } from 'apps/courses/modules/courses.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: true,
    }),
    AddressModule, 
    AuthModule, 
    ForumModule, 
    GroupModule,
    JobsModule,
    PostModule,
    CoursesModule,
    ProfileModule, 
    SettingModule, 
    ShopModule, 
    UploadModule,
    UserModule,
  ],
})
export class AppModule {}
