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
  public id: number;

  @Column({ unique: true })
  public phoneNumber: string;

  @Column({ default: false })
  public isPhoneNumberConfirmed: boolean;

  @Column({ type: 'enum', enum: UserType, default: UserType.CUSTOMER })
  role: UserType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: '' })
  profile: string;

  @Column({ type: 'timestamp', nullable: true })
  public lastLogin: Date;
}
