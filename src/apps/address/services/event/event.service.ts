import { forwardRef, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryEventInput, UpdateEventDto } from 'apps/address/dtos/event';
import { CreateEventDto } from 'apps/address/dtos/event/create-event.dto';
import { Event } from 'apps/address/entities';
import { UserToken } from 'apps/auth';
import { GroupService } from 'apps/groups';
import { BaseError, BaseService } from 'base';
import { Any, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { TableName } from 'utils';
import { checkOverlap } from 'utils';
import { AddressService } from '../address';

export const eventRelations = {
  user: true,
  address: true,
  group: true,
};

export class EventService extends BaseService<Event> {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @Inject(forwardRef(() => AddressService))
    private addressService: AddressService,
    @Inject(forwardRef(() => GroupService))
    private groupService: GroupService,
  ) {
    super(eventRepository, eventRelations);
  }

  async create(user: UserToken, createEventDto: CreateEventDto) {
    const event = await this.findOne({ user: { id: user.profile.id } });
    if ( event &&
      event.address.id === createEventDto.address &&
      event.group.id === createEventDto.group
    ) {
      BaseError(TableName.EVENT, HttpStatus.FORBIDDEN);
    }

    const address = await this.addressService.findOne({
      id: createEventDto.address,
    });

    if (!address) {
      BaseError(TableName.ADDRESS, HttpStatus.NOT_FOUND);
    }

    const group = await this.groupService.findOne({ id: createEventDto.group });

    if (!group) {
      BaseError(TableName.GROUP, HttpStatus.NOT_FOUND);
    }


    if (!checkOverlap(createEventDto.startTime.toString(), createEventDto.endTime.toString())) {
      BaseError(TableName.EVENT, HttpStatus.CONFLICT, 'time frame not suitable');
    }

    const createEvent = await this.insertOne({
      ...createEventDto,
      address,
      group,
      user: user.profile,
    });

    return { event: createEvent }
  }

  async findAll(query: QueryEventInput) {
    const { search = '', limit = 10 } = query || {};
    const where: FindOptionsWhere<Event> = {
      address: query.addresses ? Any([query.addresses]) : Not(IsNull()),
      group: query.groups ? Any([query.groups]) : Not(IsNull()),
    };

    const { data: events, total } = await this.find({
      where,
      limit,
    });

    return {
      events,
      total,
    };
  }

  async update(user: UserToken, updateEventDto: UpdateEventDto, id: string) {
    const event = await this.findOne({ id });

    if (!event) {
      BaseError(TableName.EVENT, HttpStatus.NOT_FOUND);
    }

    const address = await this.addressService.findOne({
      id: updateEventDto.address,
    });

    if (!address) {
      BaseError(TableName.EVENT, HttpStatus.NOT_FOUND);
    }

    const group = await this.groupService.findOne({ id: updateEventDto.group });

    if (!group) {
      BaseError(TableName.EVENT, HttpStatus.NOT_FOUND);
    }

    if (user.profile.id !== event.user.id) {
      BaseError(TableName.EVENT, HttpStatus.FORBIDDEN);
    }

    await this.eventRepository.save({
      id: event.id,
      ...updateEventDto,
      address,
      user: user.profile,
      group,
    });
    return {
      event: { ...event, ...updateEventDto },
    };
  }

  async findById(id: string) {
    const event = await this.findOne({ id });

    if (!event) {
      BaseError(TableName.EVENT, HttpStatus.NOT_FOUND);
    }

    return {
      event,
    };
  }

  async remove(user: UserToken, id: string) {
    const event = await this.findOne({ id });

    if (!event) {
      BaseError(TableName.EVENT, HttpStatus.NOT_FOUND);
    }

    if (user.profile.id !== event.user.id) {
      BaseError(TableName.EVENT, HttpStatus.FORBIDDEN);
    }

    return { event: await this.eventRepository.softRemove(event) };
  }
}
