import { Test, TestingModule } from '@nestjs/testing';
import { FuelInventoryController } from './fuel_inventory.controller';

describe('FuelInventoryController', () => {
  let controller: FuelInventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelInventoryController],
    }).compile();

    controller = module.get<FuelInventoryController>(FuelInventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
