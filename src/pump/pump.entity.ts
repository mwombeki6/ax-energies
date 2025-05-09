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

export enum PumpStatus {
  ACTIVE = 'active',
  IDLE = 'idle',
  MAINTENANCE = 'maintenance',
  DISABLED = 'disabled',
}

@Entity()
export class Pump {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pumpNumber: number;

  @Column()
  location: string;

  @Column({ type: 'enum', enum: PumpStatus, default: PumpStatus.IDLE })
  status: PumpStatus;

  @Column({ type: 'float', nullable: true })
  flowRate: number;

  @ManyToOne(() => Station, (station) => station.pumps, { nullable: false })
  station: Station;

  @ManyToOne(() => FuelType, (fuelType) => fuelType.pumps, { nullable: false })
  fuelType: FuelType;

  @Column({ type: 'timestamp', nullable: true })
  lastMaintenanceDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextMaintenanceDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

