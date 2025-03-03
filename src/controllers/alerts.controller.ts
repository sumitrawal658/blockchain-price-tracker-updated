import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePriceAlertDto } from '../dto/price-alert.dto';
import { PriceAlert } from '../entities/price-alert.entity';
import { PriceAlertService } from '../services/price-alert.service';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: PriceAlertService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new price alert' })
  @ApiResponse({
    status: 201,
    description: 'Price alert created successfully',
    type: PriceAlert,
  })
  async createAlert(@Body() createAlertDto: CreatePriceAlertDto) {
    return this.alertsService.createAlert(createAlertDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all configured price alerts' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all price alerts',
    type: [PriceAlert],
  })
  async getAlerts() {
    return this.alertsService.findAll();
  }
} 