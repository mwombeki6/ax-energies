// src/inventory/controllers/fuel-inventory.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FuelInventoryService } from './fuel_inventory.service';
import { CreateFuelInventoryDto, UpdateFuelInventoryDto, FuelInventoryResponseDto } from './dto/fuel_inventory.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/user.entity';

@ApiTags('fuel-inventory')
@Controller('fuel-inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FuelInventoryController {
  constructor(private readonly fuelInventoryService: FuelInventoryService) {}

  @Post()
  @Roles(UserType.ADMIN, UserType.STATION_OWNER)
  @ApiOperation({ summary: 'Create a new fuel inventory record' })
  @ApiResponse({ status: 201, description: 'Inventory record created', type: FuelInventoryResponseDto })
  create(@Body() createDto: CreateFuelInventoryDto): Promise<FuelInventoryResponseDto> {
    return this.fuelInventoryService.create(createDto);
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.STATION_OWNER)
  @ApiOperation({ summary: 'Get all fuel inventory records' })
  @ApiResponse({ status: 200, description: 'List of inventory records', type: [FuelInventoryResponseDto] })
  findAll(): Promise<FuelInventoryResponseDto[]> {
    return this.fuelInventoryService.findAll();
  }

  @Get('station/:stationId')
  @Roles(UserType.ADMIN, UserType.STATION_OWNER)
  @ApiOperation({ summary: 'Get all fuel inventory records for a specific station' })
  @ApiResponse({ status: 200, description: 'List of inventory records', type: [FuelInventoryResponseDto] })
  findByStation(@Param('stationId') stationId: string): Promise<FuelInventoryResponseDto[]> {
    return this.fuelInventoryService.findByStation(stationId);
  }

  @Get('low-levels')
  @Roles(UserType.ADMIN, UserType.STATION_OWNER)
  @ApiOperation({ summary: 'Get all fuel inventory records with low levels' })
  @ApiResponse({ status: 200, description: 'List of inventory records with low levels', type: [FuelInventoryResponseDto] })
  checkLowLevels(): Promise<FuelInventoryResponseDto[]> {
    return this.fuelInventoryService.checkLowLevels();
  }

  @Get(':id')
  @Roles(UserType.ADMIN, UserType.STATION_OWNER)
  @ApiOperation({ summary: 'Get a specific fuel inventory record' })
  @ApiResponse({ status: 200, description: 'Inventory record details', type: FuelInventoryResponseDto })
  findOne(@Param('id') id: string): Promise<FuelInventoryResponseDto> {
    return this.fuelInventoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserType.ADMIN, UserType.STATION_OWNER)
  @ApiOperation({ summary: 'Update a fuel inventory record' })
  @ApiResponse({ status: 200, description: 'Updated inventory record', type: FuelInventoryResponseDto })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateFuelInventoryDto
  ): Promise<FuelInventoryResponseDto> {
    return this.fuelInventoryService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  @ApiOperation({ summary: 'Delete a fuel inventory record' })
  @ApiResponse({ status: 200, description: 'Inventory record deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.fuelInventoryService.remove(id);
  }
}

