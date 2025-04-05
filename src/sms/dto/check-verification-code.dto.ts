import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CheckVerificationCodeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export class Create_UserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phoneNumber: string;
}
