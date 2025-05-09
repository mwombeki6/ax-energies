import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FuelType } from '../fuel_type/fuel_type.entity';
import { Station } from '../station/station.entity';

@Entity()
export class FuelPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FuelType, (fuelType) => fuelType.fuelPrice, { nullable: false })
  fuelType: FuelType;

  @ManyToOne(() => Station, (station) => station.fuelPrices, { nullable: false })
  station: Station;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: true, type: 'boolean' })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  scheduleDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

