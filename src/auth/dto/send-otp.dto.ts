import { IsPhoneNumber } from "class-validator";

export class SendOtpDto {
    @IsPhoneNumber('TZ')
    phoneNumber: string
}