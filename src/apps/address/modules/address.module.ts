import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressController } from '../controllers';
import { Address, Event, Responded } from '../entities';
import { AddressService } from '../services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address, Event, Responded])
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService]
})
export class AddressModule {}
