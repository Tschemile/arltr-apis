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
      provide: process.env.RABBITMQ_NAME,
      useFactory: () => {
        const rabbitUrl = configService.get('RABBITMQ_URL')
        const queueName = configService.get('RABBITMQ_NAME')

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [rabbitUrl],
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
