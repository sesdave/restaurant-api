// swagger.module.ts
import { Module } from '@nestjs/common';
import { SwaggerModule as NestSwaggerModule, DocumentBuilder } from '@nestjs/swagger';

@Module({})
export class SwaggerConfigModule {
  static setup(app) {
    const config = new DocumentBuilder()
      .setTitle('IvoryPay Restaurant Finder')
      .setDescription('Api to Create and Find Restaurants at closest to Users')
      .setVersion('1.0')
      .build();

    const document = NestSwaggerModule.createDocument(app, config);
    NestSwaggerModule.setup('api', app, document);
  }
}
