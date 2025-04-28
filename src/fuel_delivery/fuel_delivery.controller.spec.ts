import { Test, TestingModule } from '@nestjs/testing';
import { FuelDeliveryController } from './fuel_delivery.controller';

describe('FuelDeliveryController', () => {
  let controller: FuelDeliveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelDeliveryController],
    }).compile();

    controller = module.get<FuelDeliveryController>(FuelDeliveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
