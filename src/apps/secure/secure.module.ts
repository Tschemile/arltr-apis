import { Module } from '@nestjs/common';
import { SecureService } from './secure.service';
import { SecureController } from './secure.controller';

@Module({
  controllers: [SecureController],
  providers: [SecureService]
})
export class SecureModule {}
