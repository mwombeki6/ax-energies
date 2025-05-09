import { Module } from '@nestjs/common';
import { FuelPriceController } from './fuel_price.controller';
import { FuelPriceService } from './fuel_price.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelPrice } from './fuel-price.entity';

@Module({
  controllers: [FuelPriceController],
  providers: [FuelPriceService],
  imports: [TypeOrmModule.forFeature([FuelPrice])]
})
export class FuelPriceModule {}
