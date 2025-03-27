import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { SmsService } from '../sms/sms.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
    constructor(
      private jwtService: JwtService,
      private config: ConfigService,
      private redis: RedisService,
      private smsService: SmsService,
      private usersService: UsersService,
    ) {}

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async initiateLogin(phoneNumber: string): Promise<void> {
        const otp = this.generateOtp();
        const ttl = this.config.get<number>('OTP_TTL');

        await this.redis.set(`otp:${phoneNumber}`, otp, 'EX', ttl);
        await this.smsService.sendOtp(phoneNumber, otp);
    }

    async verifyOtp(phoneNumber: string, code: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }> {
        const storedOtp = await this.redis.get(`otp:${phoneNumber}`);

        if (!storedOtp || storedOtp !== code) {
            throw new UnauthorizedException('Invalid OTP');
        }

        await this.redis.del(`otp:${phoneNumber}`);
        const user = await this.usersService.findOrCreate(phoneNumber);

        return {
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user),
            user,
        };
    }

    private generateAccessToken(user: User): string {
        return this.jwtService.sign({
            sub: user.id,
            phoneNumber: user.phoneNumber,
            role: user.role,
        });
    }

    private generateRefreshToken(user: User): string {
        return this.jwtService.sign({
            sub: user.id,
        }, {
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
        });
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });

            const user = await this.usersService.findById(payload.sub);
            if (!user) throw new UnauthorizedException();

            return {
                accessToken: this.generateAccessToken(user),
                refreshToken: this.generateRefreshToken(user),
            };
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}