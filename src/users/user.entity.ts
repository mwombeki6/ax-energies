import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserType {
  CUSTOMER = 'customer',
  STATION_OWNER = 'station_owner',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true, unique: true })
  public phoneNumber: string;

  @Column({ default: false })
  public isPhoneNumberConfirmed: boolean;

  @Column({ type: 'enum', enum: UserType })
  role: UserType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: '' })
  profile: string;

  @Column({ type: 'timestamp', nullable: true })
  public lastLogin: Date;

  // Profile fields for station owners
  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  businessAddress: string;

  @Column({ nullable: true })
  profileImageUrl: string; // Optional

  isAdmin(): boolean {
    return this.role === UserType.ADMIN;
  }
}
