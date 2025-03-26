import { IsPhoneNumber } from "class-validator";

export class RequestOtpDto {
    @IsPhoneNumber('TZ')
    phoneNumber: string
}