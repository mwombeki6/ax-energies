import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export enum FuelStatus {
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  CRITICAL = 'CRITICAL',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export class CreateFuelInventoryDto {
  @IsUUID()
  stationId: string;

  @IsUUID()
  fuelTypeId: string;

  @IsNumber()
  @Min(0)
  currentLevel: number;

  @IsNumber()
  @Min(0)
  capacity: number;

  @IsNumber()
  @Min(0)
  lowLevelThreshold: number;
}

export class UpdateFuelInventoryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentLevel: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  capacity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lowLevelThreshold?: number;
}

export class FuelInventoryResponseDto {
  id: string;

  @Transform(({ obj }) => obj.station?.id)
  //station: string;

  @Transform(({ obj }) => obj.station?.name)
  stationName: string;

  @Transform(({ obj }) => obj.fuelType?.id)
  //fuelTypes: string;

  @Transform(({ obj }) => obj.fuelType?.name)
  fuelTypeName: string;

  currentLevel: number;
  capacity: number;
  lowLevelThreshold: number;

  @Transform(({ obj }) => {
    if (!obj.capacity || obj.capacity === 0) return 0;
    return Math.round((obj.currentLevel / obj.capacity) * 100);
  })
  percentageFull: number;

  @Transform(({ obj }) => {
    if (obj.currentLevel <= 0) return FuelStatus.OUT_OF_STOCK;
    if (obj.currentLevel <= obj.lowLevelThreshold / 2) return FuelStatus.CRITICAL;
    if (obj.currentLevel <= obj.lowLevelThreshold) return FuelStatus.LOW;
    return FuelStatus.NORMAL;
  })
  status: FuelStatus;

  lastRefillDate?: Date;
  expectedDeliveryDate?: Date;
  updatedAt: Date;
}

