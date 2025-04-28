// src/inventory/controllers/fuel-delivery.controller.ts
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FuelDeliveryService } from './fuel_delivery.service';
import {
  CreateFuelDeliveryDto,
  FuelDeliveryResponseDto,
} from './dto/fuel_delivery.dto';
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/user.entity';

@ApiTags('fuel-delivery')
@Controller('fuel-delivery')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FuelDeliveryController {
  constructor(private readonly fuelDeliveryService: FuelDeliveryService) {}

  @Post()
  @Roles(UserType.STATION_OWNER, UserType.ADMIN)
  @ApiOperation({ summary: 'Record a new fuel delivery' })
  @ApiResponse({
    status: 201,
    description: 'Fuel delivery recorded',
    type: FuelDeliveryResponseDto,
  })
  create(
    @Body() createDto: CreateFuelDeliveryDto,
  ): Promise<FuelDeliveryResponseDto> {
    return this.fuelDeliveryService.create(createDto);
  }

  @Get()
  @Roles(UserType.STATION_OWNER, UserType.ADMIN)
  @ApiOperation({ summary: 'Get all fuel deliveries' })
  @ApiResponse({
    status: 200,
    description: 'List of fuel deliveries',
    type: [FuelDeliveryResponseDto],
  })
  findAll(): Promise<FuelDeliveryResponseDto[]> {
    return this.fuelDeliveryService.findAll();
  }

  @Get('station/:stationId')
  @Roles(UserType.STATION_OWNER, UserType.ADMIN)
  @ApiOperation({ summary: 'Get all fuel deliveries for a specific station' })
  @ApiResponse({
    status: 200,
    description: 'List of fuel deliveries',
    type: [FuelDeliveryResponseDto],
  })
  findByStation(
    @Param('stationId') stationId: string,
  ): Promise<FuelDeliveryResponseDto[]> {
    return this.fuelDeliveryService.findByStation(stationId);
  }

  @Get(':id')
  @Roles(UserType.STATION_OWNER, UserType.ADMIN)
  @ApiOperation({ summary: 'Get a specific fuel delivery' })
  @ApiResponse({
    status: 200,
    description: 'Fuel delivery details',
    type: FuelDeliveryResponseDto,
  })
  findOne(@Param('id') id: string): Promise<FuelDeliveryResponseDto> {
    return this.fuelDeliveryService.findOne(id);
  }
}
