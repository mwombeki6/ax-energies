import { Module } from '@nestjs/common';
import { FuelInventoryController } from './fuel_inventory.controller';
import { FuelInventoryService } from './fuel_inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelInventory } from './fuel_inventory.entity';
import { Station } from '../station/station.entity';
import { FuelType } from '../fuel_type/fuel_type.entity';
import { Pump } from '../pump/pump.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FuelInventory, Station, FuelType, Pump])],
  controllers: [FuelInventoryController],
  providers: [FuelInventoryService],
  exports: [FuelInventoryService, TypeOrmModule],
})
export class FuelInventoryModule {}
