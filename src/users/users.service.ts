import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findByPhone(phoneNumber: string): Promise<User | undefined> {
        return this.userRepository.find({ where: { phoneNumber }});
    }

    async createUser(phoneNumber: string, role: UserType = UserType.CUSTOMER): Promise<User> {
        let user = await this.findByPhone(phoneNumber);
        if (!user) {
          user = this.userRepository.create({ phoneNumber, role });
          await this.userRepository.save(user);
        }
        return user;
      }
}
