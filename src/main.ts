import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from 'utils';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'

config()
const configService = new ConfigService()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = configService.get('PORT') || 5000
  app.enableCors()
  // Validator 
  app.useGlobalPipes(new ValidationPipe());

  // Prefix
  app.setGlobalPrefix('/api')

  // Swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document)

  await app.listen(PORT);
  console.log(`Application running on ${await (app.getUrl())}`);
}
bootstrap();
