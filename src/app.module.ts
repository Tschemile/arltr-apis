import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import apps from 'apps';
import { JwtAuthGuard, RolesGuard } from 'apps/auth';
import providers from 'providers';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ...providers,
    ...apps,
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
