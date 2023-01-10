import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule, AuthModule, ForumModule, ProfileModule, SettingModule, ShopModule, UserModule } from 'apps';
import { JobsModule } from 'apps/jobs/modules/jobs.module';

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
    ProfileModule,
    AuthModule,
    ForumModule,
    SettingModule,
    JobsModule,
    UserModule,
    ShopModule,
  ],
})
export class AppModule {}
