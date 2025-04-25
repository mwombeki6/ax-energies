import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateFuelDeliveryDto {
  @IsUUID()
  stationId: string;

  @IsUUID()
  fuelInventoryId: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @IsString()
  invoiceNumber: string;

  @IsString()
  supplierName: string;

  @IsNumber()
  @Min(0)
  purchasePrice: number;
}

export class FuelDeliveryResponseFDto {
  id: string;
  stationId: string;
  stationName: string;
  fuelInventoryId: string;
  fuelTypeName: string;
  quantity: number;
  deliveryDate: Date;
  invoiceNumber: string;
  supplierName: string;
  purchasePrice: number;
  createdAt: Date;
}
