import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwapQueryDto, SwapResponseDto } from '../dto/swap.dto';
import { SwapService } from '../services/swap.service';

@ApiTags('Swap')
@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Get('eth-to-btc')
  @ApiOperation({ summary: 'Calculate ETH to BTC swap rate' })
  @ApiResponse({
    status: 200,
    description: 'Returns swap calculation results',
    type: SwapResponseDto,
  })
  async calculateSwap(@Query() query: SwapQueryDto): Promise<SwapResponseDto> {
    return this.swapService.calculateEthToBtc(query.amount);
  }
} 