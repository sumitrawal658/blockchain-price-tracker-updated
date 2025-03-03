import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CryptoService } from '../services/crypto.service';

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current prices for ETH and Polygon' })
  @ApiResponse({
    status: 200,
    description: 'Returns current prices for both cryptocurrencies',
    schema: {
      example: {
        ethereum: 2000.50,
        polygon: 1.23,
      },
    },
  })
  async getCurrentPrices() {
    const [ethPrice, polygonPrice] = await Promise.all([
      this.cryptoService.getEthereumPrice(),
      this.cryptoService.getPolygonPrice(),
    ]);

    return {
      ethereum: ethPrice,
      polygon: polygonPrice,
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get price history for the last 24 hours' })
  @ApiResponse({
    status: 200,
    description: 'Returns hourly prices for the last 24 hours',
    schema: {
      example: {
        ethereum: [
          { timestamp: '2024-03-20T10:00:00Z', price: 2000.50 },
          // ... more entries
        ],
        polygon: [
          { timestamp: '2024-03-20T10:00:00Z', price: 1.23 },
          // ... more entries
        ],
      },
    },
  })
  async getPriceHistory() {
    const [ethereumPrices, polygonPrices] = await Promise.all([
      this.cryptoService.getPriceHistory('ethereum'),
      this.cryptoService.getPriceHistory('polygon'),
    ]);

    return {
      ethereum: ethereumPrices,
      polygon: polygonPrices,
    };
  }
} 