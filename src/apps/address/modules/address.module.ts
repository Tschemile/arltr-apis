import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from 'apps/groups';
import { AddressController, RespondedController } from '../controllers';
import { EventController } from '../controllers/event/event.controller';
import { Address, Event, Responded } from '../entities';
import { AddressService, EventService } from '../services';
import { RespondedService } from '../services/responded/responded.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address, Event, Responded]),
    forwardRef(() => GroupModule),
  ],
  controllers: [AddressController, EventController, RespondedController],
  providers: [AddressService, EventService, RespondedService],
  exports: [AddressService, EventService, RespondedService]
})
export class AddressModule {}
