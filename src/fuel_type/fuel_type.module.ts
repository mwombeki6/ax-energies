import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelType } from './fuel_type.entity';

@Module({ imports: [TypeOrmModule.forFeature([FuelType])] })
export class FuelTypeModule {}
