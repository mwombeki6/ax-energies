import { Test, TestingModule } from '@nestjs/testing';
import { FuelDeliveryService } from './fuel_delivery.service';

describe('FuelDeliveryService', () => {
  let service: FuelDeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuelDeliveryService],
    }).compile();

    service = module.get<FuelDeliveryService>(FuelDeliveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
