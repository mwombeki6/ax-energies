import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { User } from './users/user.entity';
import { UserModule } from './users/users.module';
import { SmsModule } from './sms/sms.module';
import { AuthModule } from './auth/auth.module';
import { StationModule } from './station/station.module';
import { PumpModule } from './pump/pump.module';
import { FuelPriceModule } from './fuel_price/fuel_price.module';
import { FuelTypeModule } from './fuel_type/fuel_type.module';
import { FuelDeliveryModule } from './fuel_delivery/fuel_delivery.module';
import { FuelInventoryModule } from './fuel_inventory/fuel_inventory.module';
import { Pump } from './pump/pump.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        // Database Configuration
        DATABASE_HOST: Joi.string().default('localhost'),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USER: Joi.string().default('postgres'),
        DATABASE_PASSWORD: Joi.string().default('postgres'),
        DATABASE_NAME: Joi.string().required(),

        // Twilio Configuration
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
        TWILIO_VERIFICATION_SERVICE_SID: Joi.string().required(),
        TWILIO_SENDER_PHONE_NUMBER: Joi.string().required(),

        // JWT Configuration
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().default('1d'),

        // Application Configuration
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('production'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [User],
        synchronize: process.env.NODE_ENV !== 'production',
        autoLoadEntities: true,
      }),
    }),
    UserModule,
    SmsModule,
    AuthModule,
    StationModule,
    PumpModule,
    FuelPriceModule,
    FuelTypeModule,
    FuelInventoryModule,
    FuelDeliveryModule,
    Pump,
  ],
})
export class AppModule {}
