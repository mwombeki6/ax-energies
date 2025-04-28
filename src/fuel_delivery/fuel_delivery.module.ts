import { Module } from '@nestjs/common';
import { FuelDeliveryService } from './fuel_delivery.service';
import { FuelDeliveryController } from './fuel_delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelDelivery } from './fuel_delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FuelDelivery])],
  providers: [FuelDeliveryService],
  controllers: [FuelDeliveryController],
  exports: [FuelDeliveryService],
})
export class FuelDeliveryModule {}
