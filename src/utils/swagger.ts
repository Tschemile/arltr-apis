import { DocumentBuilder } from '@nestjs/swagger'

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Roma')
  .setDescription('The Roma APIs description')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build()