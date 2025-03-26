import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body('phoneNumber') phoneNumber: string) {
    await this.authService.sendOtp(phoneNumber);
    return { message: 'OTP sent' };
  }

  @Post('verify-otp')
  async verifyOtp(@Body('phoneNumber') phoneNumber: string, @Body('otp') otp: string) {
    return this.authService.verifyOtp(phoneNumber, otp);
  }
}

