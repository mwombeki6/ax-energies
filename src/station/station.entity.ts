import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
//import { User } from '../users/user.entity';
import { FuelInventory } from '../fuel_inventory/fuel_inventory.entity';
import { Pump } from '../pump/pump.entity';
import { User } from '../users/user.entity';
import { FuelDelivery } from '../fuel_delivery/fuel_delivery.entity';
import { FuelPrice } from '../fuel_price/fuel-price.entity';

@Entity()
export class Station {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  address: string;

  @Column({ nullable: true, type: 'string' })
  logoUrl: string;

  @Column({ nullable: true, type: 'varchar', length: 10 })
  contactPhone: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  contactEmail: string;

  @OneToMany(() => FuelPrice, (fuelPrice) => fuelPrice.station)
  fuelPrices: FuelPrice[];

  @OneToMany(() => Pump, (pump) => pump.station)
  pumps: Pump[];

  @OneToMany(() => User, (user) => user.owner, { cascade: true})
  @JoinColumn()
  users: User;

  @OneToMany(() => FuelInventory, (inventory) => inventory.station)
  fuelInventories: FuelInventory[];

  @OneToMany(() => FuelDelivery, (delivery) => delivery.station)
  fuelDeliveries: FuelDelivery[];


  //@OneToMany(() => Staff, (staff) => staff.station)
  //staff: Staff[];

  //@OneToMany(() => Transaction, (transaction) => transaction.station)
  //transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
