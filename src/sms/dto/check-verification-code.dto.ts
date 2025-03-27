import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CheckVerificationCodeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}