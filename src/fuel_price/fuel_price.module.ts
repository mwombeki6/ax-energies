import { Module } from '@nestjs/common';
import { FuelPriceController } from './fuel_price.controller';
import { FuelPriceService } from './fuel_price.service';

@Module({
  controllers: [FuelPriceController],
  providers: [FuelPriceService]
})
export class FuelPriceModule {}
