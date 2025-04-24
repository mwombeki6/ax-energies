import { Test, TestingModule } from '@nestjs/testing';
import { FuelPriceController } from './fuel_price.controller';

describe('FuelPriceController', () => {
  let controller: FuelPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelPriceController],
    }).compile();

    controller = module.get<FuelPriceController>(FuelPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
