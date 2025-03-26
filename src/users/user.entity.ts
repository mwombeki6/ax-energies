import { Entity, Column, PrimaryGeneratedColumn,  CreateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: '' })
  profile: string;
}