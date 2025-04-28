import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelInventory } from './fuel_inventory.entity';
import { Repository } from 'typeorm';
import { Station } from '../station/station.entity';
import { FuelType } from '../fuel_type/fuel_type.entity';
import { CreateFuelInventoryDto } from './dto/fuel_inventory.dto';

@Injectable()
export class FuelInventoryService {
  constructor(
    @InjectRepository(FuelInventory)
    private fuelInventoryRepository: Repository<FuelInventory>,
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    @InjectRepository(FuelType)
    private fuelTypeRepository: Repository<FuelType>,
  ) {}

  async create(createDto: CreateFuelInventoryDto): Promise<FuelInventory> {}
}
