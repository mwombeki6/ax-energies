import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

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
  station: string;
  stationName: string;
  fuelTypes: string;
  fuelTypeName: string;
  currentLevel: number;
  capacity: number;
  lowLevelThreshold: number;
  percentageFull: number;
  status: 'NORMAL' | 'LOW' | 'CRITICAL';
  updatedAt: Date;
}
