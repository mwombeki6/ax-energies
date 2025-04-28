import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelInventory } from './fuel_inventory.entity';
import { Repository } from 'typeorm';
import { Station } from '../station/station.entity';
import { FuelType } from '../fuel_type/fuel_type.entity';
import {
  CreateFuelInventoryDto,
  FuelInventoryResponseDto,
  FuelStatus,
  UpdateFuelInventoryDto,
} from './dto/fuel_inventory.dto';

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

  async create(createDto: CreateFuelInventoryDto): Promise<FuelInventory> {
    const station = await this.stationRepository.findOne({
      where: { id: createDto.stationId },
    });
    if (!station) {
      throw new NotFoundException(
        `Station with ID ${createDto.stationId} not found`,
      );
    }

    const fuelType = await this.fuelTypeRepository.findOne({
      where: { id: createDto.fuelTypeId },
    });
    if (!fuelType) {
      throw new NotFoundException(
        `Fuel type with ID ${createDto.fuelTypeId} not found`,
      );
    }

    // Check if inventory for this fuel type already exists at this station
    const existingInventory = await this.fuelInventoryRepository.findOne({
      where: {
        station: { id: createDto.stationId },
        fuelTypes: { id: createDto.fuelTypeId },
      },
      relations: ['station', 'fuelType'],
    });

    if (existingInventory) {
      throw new BadRequestException(
        `Inventory for this fuel type already exists at this station`,
      );
    }

    const inventory = new FuelInventory();
    inventory.station = station;
    inventory.fuelTypes = fuelType;
    inventory.currentLevel = createDto.currentLevel;
    inventory.capacity = createDto.capacity;
    inventory.lowLevelThreshold = createDto.lowLevelThreshold;

    return this.fuelInventoryRepository.save(inventory);
  }

  async findAll(p: {
    page: number;
    limit: number;
  }): Promise<FuelInventoryResponseDto[]> {
    const inventories = await this.fuelInventoryRepository.find({
      relations: ['station', 'fuelType'],
    });

    return inventories.map((inventory) => this.mapToResponseDto(inventory));
  }

  async findByStation(
    stationId: string,
    p: { page: number; limit: number },
  ): Promise<FuelInventoryResponseDto[]> {
    const inventories = await this.fuelInventoryRepository.find({
      where: { station: { id: stationId } },
      relations: ['station', 'fuelType'],
    });

    return inventories.map((inventory) => this.mapToResponseDto(inventory));
  }

  async findOne(id: string): Promise<FuelInventoryResponseDto> {
    const inventory = await this.fuelInventoryRepository.findOne({
      where: { id },
      relations: ['station', 'fuelType'],
    });

    if (!inventory) {
      throw new NotFoundException(`Fuel inventory with ID ${id} not found`);
    }

    return this.mapToResponseDto(inventory);
  }

  async update(
    id: string,
    updateDto: UpdateFuelInventoryDto,
  ): Promise<FuelInventoryResponseDto> {
    const inventory = await this.fuelInventoryRepository.findOne({
      where: { id },
      relations: ['station', 'fuelType'],
    });

    if (!inventory) {
      throw new NotFoundException(`Fuel inventory with ID ${id} not found`);
    }

    // Update the inventory fields
    if (updateDto.currentLevel !== undefined) {
      inventory.currentLevel = updateDto.currentLevel;
    }
    if (updateDto.capacity !== undefined) {
      inventory.capacity = updateDto.capacity;
    }
    if (updateDto.lowLevelThreshold !== undefined) {
      inventory.lowLevelThreshold = updateDto.lowLevelThreshold;
    }

    // Validate that current level doesn't exceed capacity
    if (inventory.currentLevel > inventory.capacity) {
      throw new BadRequestException('Current level cannot exceed capacity');
    }

    const updatedInventory = await this.fuelInventoryRepository.save(inventory);
    return this.mapToResponseDto(updatedInventory);
  }

  async remove(id: string): Promise<void> {
    const result = await this.fuelInventoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Fuel inventory with ID ${id} not found`);
    }
  }

  // Method to update inventory level after a fuel delivery
  async updateLevelAfterDelivery(
    id: string,
    quantity: number,
  ): Promise<FuelInventoryResponseDto> {
    const inventory = await this.fuelInventoryRepository.findOne({
      where: { id },
      relations: ['station', 'fuelType'],
    });

    if (!inventory) {
      throw new NotFoundException(`Fuel inventory with ID ${id} not found`);
    }

    const newLevel = inventory.currentLevel + quantity;

    // Check if new level exceeds capacity
    if (newLevel > inventory.capacity) {
      throw new BadRequestException(
        `Delivery would exceed tank capacity. Maximum additional quantity allowed: ${inventory.capacity - inventory.currentLevel}`,
      );
    }

    inventory.currentLevel = newLevel;
    const updatedInventory = await this.fuelInventoryRepository.save(inventory);

    return this.mapToResponseDto(updatedInventory);
  }

  // Method to update inventory level after a fuel sale
  async updateLevelAfterSale(
    id: string,
    quantity: number,
  ): Promise<FuelInventoryResponseDto> {
    const inventory = await this.fuelInventoryRepository.findOne({
      where: { id },
      relations: ['station', 'fuelType'],
    });

    if (!inventory) {
      throw new NotFoundException(`Fuel inventory with ID ${id} not found`);
    }

    const newLevel = inventory.currentLevel - quantity;

    // Check if new level would go below zero
    if (newLevel < 0) {
      throw new BadRequestException(
        `Insufficient fuel quantity. Available: ${inventory.currentLevel}`,
      );
    }

    inventory.currentLevel = newLevel;
    const updatedInventory = await this.fuelInventoryRepository.save(inventory);

    return this.mapToResponseDto(updatedInventory);
  }

  // Check if any stations have low fuel levels
  async checkLowLevels(): Promise<FuelInventoryResponseDto[]> {
    const inventories = await this.fuelInventoryRepository.find({
      relations: ['station', 'fuelType'],
    });

    return inventories
      .filter(
        (inventory) => inventory.currentLevel <= inventory.lowLevelThreshold,
      )
      .map((inventory) => this.mapToResponseDto(inventory));
  }

  private getInventoryStatus(inventory: FuelInventory): FuelStatus {
    if (inventory.currentLevel <= 0) return FuelStatus.OUT_OF_STOCK;
    if (inventory.currentLevel <= inventory.lowLevelThreshold / 2)
      return FuelStatus.CRITICAL;
    if (inventory.currentLevel <= inventory.lowLevelThreshold)
      return FuelStatus.LOW;
    return FuelStatus.NORMAL;
  }

  private mapToResponseDto(inventory: FuelInventory): {
    id: string;
    station: string;
    stationName: string;
    fuelTypes: string;
    fuelTypeName: string;
    currentLevel: number;
    capacity: number;
    lowLevelThreshold: number;
    percentageFull: number;
    status: FuelStatus;
    lastRefillDate: Date;
    expectedDeliveryDate: Date;
    updatedAt: Date;
  } {
    const percentageFull =
      inventory.capacity > 0
        ? (inventory.currentLevel / inventory.capacity) * 100
        : 0;

    return {
      id: inventory.id,
      station: inventory.station.id,
      stationName: inventory.station.name,
      fuelTypes: inventory.fuelTypes.id,
      fuelTypeName: inventory.fuelTypes.name,
      currentLevel: inventory.currentLevel,
      capacity: inventory.capacity,
      lowLevelThreshold: inventory.lowLevelThreshold,
      percentageFull: Math.round(percentageFull),
      status: this.getInventoryStatus(inventory),
      lastRefillDate: inventory.lastRefillDate,
      expectedDeliveryDate: inventory.expectedDeliveryDate,
      updatedAt: inventory.updatedAt,
    };
  }
}
