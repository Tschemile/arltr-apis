import {
    ClassSerializerInterceptor,
    Controller,
    Inject,
    UseInterceptors,
  } from '@nestjs/common';
  
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { TableName } from 'utils';
  
@ApiTags(TableName.RABBITMQ)
@Controller(TableName.RABBITMQ.toLowerCase())
@UseInterceptors(ClassSerializerInterceptor)
export class RabbitMQSubscriberController {
    constructor(
      @Inject(process.env.RABBITMQ_QUEUE_NAME) private subscribersService: ClientProxy,
    ) {}
   
  }
  