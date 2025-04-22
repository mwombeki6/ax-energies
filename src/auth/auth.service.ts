import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { User, UserType } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phoneNumber: string): Promise<User | null> {
    return this.userService.getByPhoneNumber(phoneNumber);
  }

  async createUser(phoneNumber: string): Promise<User> {
    return this.userService.create({ phoneNumber });
  }

  async login(user: User) {
    const payload = { phoneNumber: user.phoneNumber, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async createStationOwner(email: string, password: string): Promise<string> {
    return this.userService.createStationOwner({email, password})
  }

  async loginStationOwner(email: string, password: string): Promise<any> {
    const user = await this.userService.getByEmail(email);
    if (!user || user.role !== UserType.STATION_OWNER) {
      throw new UnauthorizedException();
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException();

    return {
      access_token: this.jwtService.signAsync(user),
      user,
    }
  }
}
