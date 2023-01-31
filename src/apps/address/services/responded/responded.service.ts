import { forwardRef, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateRespondedDto,
  QueryRespondedInput,
  UpdateRespondedDto,
} from 'apps/address/dtos';
import { Responded } from 'apps/address/entities';
import { UserToken } from 'apps/auth';
import { BaseError, BaseService } from 'base';
import { Any, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { TableName } from 'utils';
import { EventService } from '../event';

const respondedRelatetions = {
  user: true,
  event: true,
};

export class RespondedService extends BaseService<Responded> {
  constructor(
    @InjectRepository(Responded)
    private respondedRepository: Repository<Responded>,
    @Inject(forwardRef(() => EventService))
    private eventService: EventService,
  ) {
    super(respondedRepository, respondedRelatetions);
  }

  async create(createRespondedDto: CreateRespondedDto, user: UserToken) {
    const event = await this.eventService.findOne({
      id: createRespondedDto.event,
    });

    if (!event) {
      BaseError(TableName.EVENT, HttpStatus.NOT_FOUND);
    }

    const createResponded = await this.insertOne({
      ...createRespondedDto,
      user: user.profile,
      event,
    });

    return { responded: createResponded };
  }

  async findAll(query: QueryRespondedInput) {
    const { search = '', limit = 10 } = query || {};
    const where: FindOptionsWhere<Responded> = {
      type: query.type ? Any([query.type]) : Not(IsNull()),
      event: query.events ? Any([query.events]) : Not(IsNull()),
      user: query.users ? Any([query.users]) : Not(IsNull()),
    };

    const { data: responders, total } = await this.find({
      where,
      limit,
    });

    return {
      responders,
      total,
    };
  }

  async update(
    id: string,
    updateRespondedDto: UpdateRespondedDto,
    user: UserToken,
  ) {
    const event = await this.eventService.findOne({
      id: updateRespondedDto.event,
    });

    if (!event) {
      BaseError(TableName.EVENT, HttpStatus.NOT_FOUND);
    }

    const responded = await this.findOne({ id });

    if (!responded) {
      BaseError(TableName.RESPONDED, HttpStatus.NOT_FOUND);
    }

    if (responded.user.id !== user.profile.id) {
      BaseError(TableName.RESPONDED, HttpStatus.FORBIDDEN);
    }

    await this.respondedRepository.save({
      id: responded.id,
      ...updateRespondedDto,
      user: user.profile,
      event,
    });

    return {
      responded: { ...responded, ...updateRespondedDto },
    };
  }

  async findById(id: string) {
    const responded = await this.findOne({ id });

    if (!responded) {
      BaseError(TableName.RESPONDED, HttpStatus.NOT_FOUND);
    }
    return {
      responded,
    };
  }

  async remove(id: string, user: UserToken) {
    const responded = await this.findOne({ id });

    if (!responded) {
      BaseError(TableName.RESPONDED, HttpStatus.NOT_FOUND);
    }

    if (responded.user.id !== user.profile.id) {
      BaseError(TableName.RESPONDED, HttpStatus.FORBIDDEN);
    }

    return { responded: await this.respondedRepository.softRemove(responded) };
  }
}
