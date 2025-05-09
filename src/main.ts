import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as v8 from 'v8';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  const config = new DocumentBuilder()
    .setTitle('Ax Energies')
    .setDescription('The axEnergies API description')
    .setVersion('1.0')
    .addTag('energies')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  setInterval(() => {
    const heapStats = v8.getHeapStatistics();
    console.log(`Heap size limit: ${heapStats.heap_size_limit / 1024 / 1024}MB`);
    console.log(`Total heap size: ${heapStats.total_heap_size / 1024 / 1024}MB`);
    console.log(`Used heap size: ${heapStats.used_heap_size / 1024 / 1024}MB`);
  }, 60000);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

