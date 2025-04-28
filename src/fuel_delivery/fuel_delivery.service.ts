import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuelDelivery } from './fuel_delivery.entity';
import { FuelInventory } from '../fuel_inventory/fuel_inventory.entity';
import { Station } from '../station/station.entity';
import { FuelInventoryService } from '../fuel_inventory/fuel_inventory.service';
import { CreateFuelDeliveryDto, FuelDeliveryResponseDto } from './dto/fuel_delivery.dto';

@Injectable()
export class FuelDeliveryService {
  constructor(
    @InjectRepository(FuelDelivery)
    private fuelDeliveryRepository: Repository<FuelDelivery>,
    @InjectRepository(FuelInventory)
    private fuelInventoryRepository: Repository<FuelInventory>,
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    private fuelInventoryService: FuelInventoryService,
  ) {}

  async create(createDto: CreateFuelDeliveryDto): Promise<FuelDeliveryResponseDto> {
    const station = await this.stationRepository.findOne({ where: { id: createDto.stationId } });
    if (!station) {
      throw new NotFoundException(`Station with ID ${createDto.stationId} not found`);
    }

    const inventory = await this.fuelInventoryRepository.findOne({
      where: { id: createDto.fuelInventoryId },
      relations: ['fuelType'],
    });
    if (!inventory) {
      throw new NotFoundException(`Fuel inventory with ID ${createDto.fuelInventoryId} not found`);
    }

    // Update the inventory level first
    await this.fuelInventoryService.updateLevelAfterDelivery(
      inventory.id,
      createDto.quantity,
    );

    // Create and save the delivery record
    const delivery = new FuelDelivery();
    delivery.station = station;
    delivery.fuelInventory = inventory;
    delivery.quantity = createDto.quantity;
    delivery.deliveryDate = createDto.deliveryDate ? new Date(createDto.deliveryDate) : new Date();
    delivery.invoiceNumber = createDto.invoiceNumber;
    delivery.supplierName = createDto.supplierName;
    delivery.purchasePrice = createDto.purchasePrice;

    const savedDelivery = await this.fuelDeliveryRepository.save(delivery);

    return this.mapToResponseDto(savedDelivery);
  }

  async findAll(): Promise<FuelDeliveryResponseDto[]> {
    const deliveries = await this.fuelDeliveryRepository.find({
      relations: ['station', 'fuelInventory', 'fuelInventory.fuelType'],
      order: { deliveryDate: 'DESC' },
    });

    return deliveries.map(delivery => this.mapToResponseDto(delivery));
  }

  async findByStation(stationId: string): Promise<FuelDeliveryResponseDto[]> {
    const deliveries = await this.fuelDeliveryRepository.find({
      where: { station: { id: stationId } },
      relations: ['station', 'fuelInventory', 'fuelInventory.fuelType'],
      order: { deliveryDate: 'DESC' },
    });

    return deliveries.map(delivery => this.mapToResponseDto(delivery));
  }

  async findOne(id: string): Promise<FuelDeliveryResponseDto> {
    const delivery = await this.fuelDeliveryRepository.findOne({
      where: { id },
      relations: ['station', 'fuelInventory', 'fuelInventory.fuelType'],
    });

    if (!delivery) {
      throw new NotFoundException(`Fuel delivery with ID ${id} not found`);
    }

    return this.mapToResponseDto(delivery);
  }

  private mapToResponseDto(delivery: FuelDelivery): FuelDeliveryResponseDto {
    return {
      id: delivery.id,
      stationId: delivery.station.id,
      stationName: delivery.station.name,
      fuelInventoryId: delivery.fuelInventory.id,
      fuelTypeName: delivery.fuelInventory.fuelTypes.name,
      quantity: delivery.quantity,
      deliveryDate: delivery.deliveryDate,
      invoiceNumber: delivery.invoiceNumber,
      supplierName: delivery.supplierName,
      purchasePrice: delivery.purchasePrice,
      createdAt: delivery.createdAt,
    };
  }
}
