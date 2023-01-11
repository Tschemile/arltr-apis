import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from 'utils';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
  // Validator 
  app.useGlobalPipes(new ValidationPipe());

  // Prefix
  app.setGlobalPrefix('/api')

  // Swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document)

  await app.listen(5000);
  console.log(`Application running on ${await (app.getUrl())}`);
}
bootstrap();
