import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from 'apps/groups';
import { AddressController } from '../controllers';
import { EventController } from '../controllers/event/event.controller';
import { Address, Event, Responded } from '../entities';
import { AddressService, EventService } from '../services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address, Event, Responded]),
    forwardRef(() => GroupModule),
  ],
  controllers: [AddressController, EventController],
  providers: [AddressService, EventService],
  exports: [AddressService, EventService]
})
export class AddressModule {}
