import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SmsService } from '../sms/sms.service';
import {
  CheckVerificationCodeDto,
  Create_UserDto,
} from '../sms/dto/check-verification-code.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private smsService: SmsService,
  ) {}

  @Post('login')
  async requestLogin(@Body() verificationData: Create_UserDto) {
    if (!verificationData.phoneNumber) {
      throw new BadRequestException('Phone number is required');
    }

    try {
      let user = await this.authService.validateUser(
        verificationData.phoneNumber,
      );
      if (!user) {
        user = await this.authService.createUser(verificationData.phoneNumber);
      }

      await this.smsService.initiatePhoneNumberVerification(
        verificationData.phoneNumber,
      );
      return { message: 'Verification code sent', user };
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
      const user = await this.authService.validateUser(
        verificationData.phoneNumber,
      );
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
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Verification failed:', error);
      throw new BadRequestException('Verification failed');
    }
  }

  @Post('registerStationOwner')
  async registerStationOwner(@Body() verificationData: RegisterDto) {
    return this.authService.createStationOwner(
      verificationData.email,
      verificationData.password,
    );
  }

  @Post('loginStationOwner')
  async loginStationOwner(@Body() verificationData: LoginDto) {
    return this.authService.loginStationOwner(
      verificationData
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }
}
