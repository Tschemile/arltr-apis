import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AddressModule,
  AuthModule,
  CoursesModule,
  ForumModule,
  GroupModule,
  JobsModule,
  JwtAuthGuard,
  PostModule,
  ProfileModule,
  RolesGuard,
  SettingModule,
  ShopModule,
  UploadModule,
  UserModule
} from 'apps';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false
      }
    }),
    ScheduleModule.forRoot(),
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ]
})
export class AppModule { }
