import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum UserType {
  CUSTOMER = 'customer',
  ATTENDANT = 'attendant',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.CUSTOMER })
  role: UserType;

  @Column()
  otpHash: string;

  @Column()
  otpExpiry: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: '' })
  profile: string;
}
