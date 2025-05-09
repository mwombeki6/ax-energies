import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Station } from '../station/station.entity';

export enum UserType {
  CUSTOMER = 'customer',
  STATION_OWNER = 'station_owner',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true, unique: true, type: 'varchar', length: 100 })
  email: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  password: string;

  @Column({ nullable: true, unique: true, type: 'varchar', length: 10 })
  public phoneNumber: string;

  @Column({ default: false, type: 'boolean' })
  public isPhoneNumberConfirmed: boolean;

  @Column({ type: 'enum', enum: UserType })
  role: UserType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: '', type: 'varchar' })
  profile: string;

  @Column({ type: 'timestamp', nullable: true })
  public lastLogin: Date;

  // Profile fields for station owners
  @Column({ nullable: true, type: 'varchar' })
  fullName: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  companyName: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  businessAddress: string;

  @Column({ nullable: true, type: 'varchar' })
  profileImageUrl: string; // Optional

  @OneToOne(() => Station, (station) => station.users)
  owner: Station;

  isAdmin(): boolean {
    return this.role === UserType.ADMIN;
  }

  isStationOwner(): boolean {
    return this.role === UserType.STATION_OWNER;
  }
}
