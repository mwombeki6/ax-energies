import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pump } from '../pump/pump.entity';
import { FuelInventory } from '../fuel_inventory/fuel_inventory.entity';
import { FuelPrice } from '../fuel_price/fuel-price.entity';

@Entity()
export class FuelType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  description: string;

  @OneToMany(() => Pump, (pump) => pump.fuelType)
  pumps: Pump[];

  @OneToMany(() => FuelInventory, (inventory) => inventory.fuelType)
  fuelInventories: FuelInventory[];

  @OneToMany(() => FuelPrice, (price) => price.fuelType)
  fuelPrice: FuelPrice[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

