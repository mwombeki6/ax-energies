import {
  BadRequestException,
  Injectable,

} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { UserService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const accountSid = configService.get('TWILIO_ACCOUNT_SID');
    const authToken = configService.get('TWILIO_AUTH_TOKEN');

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async initiatePhoneNumberVerification(phoneNumber: string) {
    const serviceSid = this.configService.get(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );

    try {
      return await this.twilioClient.verify
        .services(serviceSid)
        .verifications.create({ to: phoneNumber, channel: 'sms' });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async confirmPhoneNumber(
    userId: number,
    phoneNumber: string,
    verificationCode: string,
  ): Promise<User> {
    const serviceSid = this.configService.get(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );

    try {
      const result = await this.twilioClient.verify
        .services(serviceSid)
        .verificationChecks.create({ to: phoneNumber, code: verificationCode });

      if (!result.valid || result.status !== 'approved') {
        throw new BadRequestException('Wrong code provided');
      }

      return await this.userService.markPhoneNumberAsConfirmed(userId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Verification failed');
    }
  }

  async sendMessage(receiverPhoneNumber: string, message: string) {
    const senderPhoneNumber = this.configService.get(
      'TWILIO_SENDER_PHONE_NUMBER',
    );

    if (!senderPhoneNumber) {
      throw new BadRequestException(
        'Twilio sender phone number is not configured',
      );
    }

    try {
      const response = await this.twilioClient.messages.create({
        body: message,
        from: senderPhoneNumber,
        to: receiverPhoneNumber,
      });

      console.log('Twilio SMS Response:', response); // Log Twilio response for debugging
      return { message: 'Message sent successfully', sid: response.sid };
    } catch (error) {
      console.error('Twilio Error:', error); // Log detailed error
      throw new BadRequestException(`Failed to send message: ${error.message}`);
    }
  }
}
