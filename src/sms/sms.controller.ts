import {
  Body,
  Controller,
  Post,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { SmsService } from './sms.service';
import { CheckVerificationCodeDto } from './dto/check-verification-code.dto';
import { UserService } from '../users/users.service';

@Controller('sms')
export class SmsController {
  constructor(
    private readonly smsService: SmsService,
    private readonly userService: UserService,
  ) {}

  @Post(':phoneNumber/initiate-verification')
  async initiatePhoneNumberVerification(
    @Param('phoneNumber') phoneNumber: string,
  ) {
    await this.smsService.initiatePhoneNumberVerification(phoneNumber);
    return { message: 'Verification code sent' };
  }

  @Post(':phoneNumber/check-verification-code')
  async checkVerificationCode(
    @Param('phoneNumber') phoneNumber: string,
    @Body() verificationData: CheckVerificationCodeDto,
  ) {
    // @ts-ignore
    const user = await this.userService.getByPhoneNumber(phoneNumber);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    //Verify the code
    const verifiedUser = await this.smsService.confirmPhoneNumber(
      user.id,
      phoneNumber,
      verificationData.code,
    );

    return { message: 'Phone number confirmed', user };
  }

  @Post(':phoneNumber/send-message')
  async sendMessage(
    @Param('phoneNumber') phoneNumber: string,
    @Body('message') message: string,
  ) {
    await this.smsService.sendMessage(phoneNumber, message);
    return { message: 'Message sent' };
  }
}
