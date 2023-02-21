import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';

config()
const configService = new ConfigService()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: process.env.RABBITMQ_QUEUE_NAME,
      useFactory: () => {
        const user = configService.get('RABBITMQ_USER');
        const password = configService.get('RABBITMQ_PASSWORD');
        const host = configService.get('RABBITMQ_HOST');
        const queueName = configService.get('RABBITMQ_QUEUE_NAME');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
              durable: true
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class RabbitMQSubscriberModule {}
