import { Module } from '@nestjs/common';
import { FuelInventoryController } from './fuel_inventory.controller';
import { FuelInventoryService } from './fuel_inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelInventory } from './fuel_inventory.entity';
import { Station } from '../station/station.entity';
import { FuelType } from '../fuel_type/fuel_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FuelInventory, Station, FuelType])],
  controllers: [FuelInventoryController],
  providers: [FuelInventoryService],
  exports: [FuelInventoryService],
})
export class FuelInventoryModule {}
