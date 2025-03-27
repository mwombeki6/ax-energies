// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOrCreate(phoneNumber: string): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { phoneNumber } });

    if (!user) {
      user = this.usersRepository.create({
        phoneNumber,
        role: UserType.CUSTOMER,
      });
      await this.usersRepository.save(user);
    }

    return user;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    // @ts-ignore
    return this.usersRepository.findOne({ where: { id } });
  }

  async findById(id: string): Promise<User> {
    // @ts-ignore
    return this.usersRepository.findOne({ where: { id } });
  }
}
