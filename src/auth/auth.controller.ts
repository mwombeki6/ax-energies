import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body('phoneNumber') phoneNumber: string) {
    await this.authService.initiateLogin(phoneNumber);
    return { message: 'OTP sent successfully' };
  }

  @Post('verify-otp')
  async verifyOtp(@Body('phoneNumber') phoneNumber: string, @Body('otp') otp: string) {
    return this.authService.verifyOtp(phoneNumber, otp);
  }
}

