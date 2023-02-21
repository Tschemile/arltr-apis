import { Injectable } from '@nestjs/common';
import type { RmqContext } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor() {}

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
