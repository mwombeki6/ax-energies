import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Station } from '../station/station.entity';
import { FuelInventory } from '../fuel_inventory/fuel_inventory.entity';

@Entity()
export class FuelDelivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Station, (station) => station.fuelDeliveries, { nullable: false })
  station: Station;

  @ManyToOne(() => FuelInventory, (inventory) => inventory.deliveries, { nullable: false })
  fuelInventory: FuelInventory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'timestamp' })
  deliveryDate: Date;

  @Column({ type: 'varchar', length: 100 })
  invoiceNumber: string;

  @Column({ type: 'varchar', length: 100 })
  supplierName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  purchasePrice: number;

  @CreateDateColumn()
  createdAt: Date;
}

