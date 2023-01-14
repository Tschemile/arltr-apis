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
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
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
