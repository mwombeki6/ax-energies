import { Test, TestingModule } from '@nestjs/testing';
import { FuelPriceService } from './fuel_price.service';

describe('FuelPriceService', () => {
  let service: FuelPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuelPriceService],
    }).compile();

    service = module.get<FuelPriceService>(FuelPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
