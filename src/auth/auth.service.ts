import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { User, UserType } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

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
    return this.userService.createStationOwner({ email, password });
  }

  async loginStationOwner(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.getByEmail(loginDto.email);
    if (!user || user.role !== UserType.STATION_OWNER) {
      throw new UnauthorizedException();
    }

    const match = await bcrypt.compare(loginDto.password, user.password);
    if (!match) throw new UnauthorizedException();

    // Update Last Login
    await this.userService.updateLastLogin(user.id);

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.signAsync(payload),
      user: {payload},
    };
  }
}
