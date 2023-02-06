import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import { config } from 'dotenv';
import { swaggerConfig } from 'utils';
import { AppModule } from './app.module';

config()
const configService = new ConfigService()

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
  );
  const PORT = configService.get('PORT') || 5000
  app.enableCors()
  // Validator 
  app.useGlobalPipes(new ValidationPipe());

  // Prefix
  app.setGlobalPrefix('/api')

  // Compression
  app.use(compression())

  // Swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document)

  await app.listen(PORT, '0.0.0.0');
  console.log(`Application running on ${await (app.getUrl())}`);
}
bootstrap();
