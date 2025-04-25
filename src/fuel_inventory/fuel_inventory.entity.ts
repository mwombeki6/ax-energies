import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Station } from '../station/station.entity';
import { FuelType } from '../fuel_type/fuel_type.entity';

@Entity()
export class FuelInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Station, (station) => station.fuelInventories)
  station: Station;

  @ManyToOne(() => FuelType)
  fuelTypes: FuelType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  currentLevel: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  lowLevelThreshold: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
