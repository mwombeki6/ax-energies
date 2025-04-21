import { IsString, IsNotEmpty, Matches, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phoneNumber: string;
}

export class CreateStationOwnerDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}