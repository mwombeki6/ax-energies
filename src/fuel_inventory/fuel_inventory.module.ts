import { Module } from '@nestjs/common';
import { FuelInventoryController } from './fuel_inventory.controller';
import { FuelInventoryService } from './fuel_inventory.service';

@Module({
  controllers: [FuelInventoryController],
  providers: [FuelInventoryService]
})
export class FuelInventoryModule {}
