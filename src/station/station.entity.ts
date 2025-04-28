import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { FuelInventory } from '../fuel_inventory/fuel_inventory.entity';
import { Pump } from '../pump/pump.entity';

@Entity()
export class Station {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  contactEmail: string;

  @OneToMany(() => Pump, (pump) => pump.station)
  pumps: Pump[];

  @OneToMany(() => User, (user) => user.station)
  users: User[];

  @OneToMany(() => FuelInventory, (inventory) => inventory.station)
  fuelInventories: FuelInventory[];

  @OneToMany(() => Staff, (staff) => staff.station)
  staff: Staff[];

  @OneToMany(() => Transaction, (transaction) => transaction.station)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
