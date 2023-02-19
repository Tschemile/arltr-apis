import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
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
import * as redisStore from "cache-manager-redis-store";
import type { RedisClientOptions } from "redis";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: true,
      // ssl: {
      //   rejectUnauthorized: false,
      // }
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      isGlobal: true,
      url: process.env.CACHE_URL,
    }),
    MailerModule.forRoot({
      transport: {
        host:'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: process.env.YOUR_API_KEY
        },
      },
      template: {
        dir: __dirname + '/mails/verify',
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      }
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
