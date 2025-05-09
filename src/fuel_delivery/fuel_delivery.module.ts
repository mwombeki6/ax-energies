import { Module } from '@nestjs/common';
import { FuelDeliveryService } from './fuel_delivery.service';
import { FuelDeliveryController } from './fuel_delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelDelivery } from './fuel_delivery.entity';
import { FuelInventoryModule } from '../fuel_inventory/fuel_inventory.module';
import { Station } from '../station/station.entity';

@Module({
  imports: [ FuelInventoryModule,TypeOrmModule.forFeature([FuelDelivery, Station])],
  providers: [FuelDeliveryService],
  controllers: [FuelDeliveryController],
  exports: [FuelDeliveryService],
})
export class FuelDeliveryModule {}
