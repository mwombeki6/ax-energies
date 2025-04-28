import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { FuelInventoryService } from './fuel_inventory.service';
import {
  CreateFuelInventoryDto,
  UpdateFuelInventoryDto,
  FuelInventoryResponseDto,
} from './dto/fuel_inventory.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/user.entity';
import { FuelInventory } from './fuel_inventory.entity';

@ApiTags('fuel-inventory')
@Controller('fuel-inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class FuelInventoryController {
  constructor(private readonly fuelInventoryService: FuelInventoryService) {}

  @Post()
  @Roles(UserType.ADMIN, UserType.STATION_OWNER)
  @ApiOperation({ summary: 'Create a new fuel inventory record' })
  @ApiResponse({
    status: 201,
    description: 'Inventory record created',
    type: FuelInventoryResponseDto,
  })
  create(@Body() createDto: CreateFuelInventoryDto): Promise<FuelInventory> {
    return this.fuelInventoryService.create(createDto);
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.STATION_OWNER)
  @ApiOperation({
    summary: 'Get all fuel inventory records with optional pagination',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of inventory records',
    type: [FuelInventoryResponseDto],
  })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<FuelInventoryResponseDto[]> {
    return this.fuelInventoryService.findAll({ page, limit });
  }

  @Get('station/:stationId')
  @Roles(UserType.ADMIN, UserType.STATION_OWNER)
  @ApiOperation({
    summary:
      'Get all fuel inventory records for a specific station with optional pagination',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of inventory records',
    type: [FuelInventoryResponseDto],
  })
  findByStation(
    @Param('stationId', new ParseUUIDPipe()) stationId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<FuelInventoryResponseDto[]> {
    return this.fuelInventoryService.findByStation(stationId, { page, limit });
  }

  @Get('low-levels')
  @Roles(UserType.ADMIN, UserType.STATION_OWNER)
  @ApiOperation({ summary: 'Get all fuel inventory records with low levels' })
  @ApiResponse({
    status: 200,
    description: 'List of inventory records with low levels',
    type: [FuelInventoryResponseDto],
  })
  checkLowLevels(): Promise<FuelInventoryResponseDto[]> {
    return this.fuelInventoryService.checkLowLevels();
  }

  @Get(':id')
  @Roles(UserType.ADMIN, UserType.STATION_OWNER)
  @ApiOperation({ summary: 'Get a specific fuel inventory record' })
  @ApiResponse({
    status: 200,
    description: 'Inventory record details',
    type: FuelInventoryResponseDto,
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<FuelInventoryResponseDto> {
    return this.fuelInventoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserType.ADMIN, UserType.STATION_OWNER)
  @ApiOperation({ summary: 'Update a fuel inventory record' })
  @ApiResponse({
    status: 200,
    description: 'Updated inventory record',
    type: FuelInventoryResponseDto,
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateFuelInventoryDto,
  ): Promise<FuelInventoryResponseDto> {
    return this.fuelInventoryService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  @ApiOperation({ summary: 'Delete a fuel inventory record' })
  @ApiResponse({ status: 200, description: 'Inventory record deleted' })
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.fuelInventoryService.remove(id);
  }
}
