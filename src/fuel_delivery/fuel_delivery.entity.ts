import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Station } from '../station/station.entity';
import { FuelInventory } from '../fuel_inventory/fuel_inventory.entity';

@Entity()
export class FuelDelivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Station)
  station: Station;

  @ManyToOne(() => FuelInventory)
  fuelInventory: FuelInventory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'datetime2' })
  deliveryDate: Date;

  @Column()
  invoiceNumber: number;

  @Column()
  supplierName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  purchasePrice: number;

  @CreateDateColumn()
  createdAt: Date;
}
