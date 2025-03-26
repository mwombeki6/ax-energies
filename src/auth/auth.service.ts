import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    private readonly apiKey = process.env.AT_API_KEY;
    private readonly username = process.env.AT_USERNAME;
    private otpStore = new Map<string, { otp: string; expiresAt: Date }>();

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async sendOtp(phoneNumber: string): Promise<string> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otpStore.set(phoneNumber, {
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });

        const smsData = {
            username: this.username,
            to: phoneNumber,
            message: `Your OTP code is: ${otp}`,
        };

        try {
            await axios.post(
                'https://api.africastalking.com/version1/messaging',
                new URLSearchParams(smsData),
                {
                    headers: {
                        'apiKey': this.apiKey,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );
            return 'OTP sent successfully!';
        } catch (error) {
            throw new Error('Failed to send OTP');
        }
    }

    async verifyOtp(phoneNumber: string, otp: string): Promise<{ token: string; role: string }> {
        const storedOtp = this.otpStore.get(phoneNumber);
        if (storedOtp !== otp) {
            throw new UnauthorizedException('Invalid OTP');
        }
        this.otpStore.delete(phoneNumber);

        const user = await this.userService.createUser(phoneNumber);
        const payload = { phoneNumber, role: user.role };
        const token = this.jwtService.sign(payload);

        return { token, role: user.role };
    }
}

