import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Station } from '../station/station.entity';
import { FuelType } from '../fuel_type/fuel_type.entity';
import { FuelDelivery } from '../fuel_delivery/fuel_delivery.entity';

@Entity()
export class FuelInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Station, (station) => station.fuelInventories)
  station: Station;

  @ManyToOne(() => FuelType, {eager: true})
  fuelType: FuelType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  currentLevel: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  lowLevelThreshold: number;

  @CreateDateColumn()
  lastRefillDate: Date;

  @CreateDateColumn()
  expectedDeliveryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FuelDelivery, (delivery) => delivery.fuelInventory)
  deliveries: FuelDelivery[];

  // Calculated properties
  get percentageFull(): number {
    return this.capacity > 0
      ? Math.round((Number(this.currentLevel) / Number(this.capacity)) * 100)
      : 0;
  }

  get status(): 'NORMAL' | 'LOW' | 'CRITICAL' {
    if (Number(this.currentLevel) <= Number(this.lowLevelThreshold) / 2) {
      return 'CRITICAL';
    } else if (Number(this.currentLevel) <= Number(this.lowLevelThreshold)) {
      return 'LOW';
    }
    return 'NORMAL';
  }

  // Convenience getters for related entities
  get stationName(): string {
    return this.station?.name || '';
  }

  get fuelTypeName(): string {
    return this.fuelType?.name || '';
  }

}
