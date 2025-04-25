import { Test, TestingModule } from '@nestjs/testing';
import { FuelInventoryService } from './fuel_inventory.service';

describe('FuelInventoryService', () => {
  let service: FuelInventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuelInventoryService],
    }).compile();

    service = module.get<FuelInventoryService>(FuelInventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
