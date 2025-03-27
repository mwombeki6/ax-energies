import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SmsService } from '../sms/sms.service';
import { CheckVerificationCodeDto } from '../sms/dto/check-verification-code.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private smsService: SmsService,
  ) {}

  @Post('login')
  async requestLogin(@Body('phoneNumber') phoneNumber: string) {
    if (!phoneNumber) {
      throw new BadRequestException('Phone number is required');
    }

    try {
      const user = await this.authService.validateUser(phoneNumber);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      await this.smsService.initiatePhoneNumberVerification(phoneNumber);
      return { message: 'Verification code sent' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('verify')
  async verifyLogin(@Body() verificationData: CheckVerificationCodeDto) {
    if (!verificationData.phoneNumber || !verificationData.code) {
      throw new BadRequestException('Phone number and code are required');
    }

    try {
      const user = await this.authService.validateUser(verificationData.phoneNumber);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const verifiedUser = await this.smsService.confirmPhoneNumber(
        user.id,
        verificationData.phoneNumber,
        verificationData.code,
      );

      return this.authService.login(verifiedUser);
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Verification failed');
    }
  }
}