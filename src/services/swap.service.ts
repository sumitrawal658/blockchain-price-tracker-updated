import { Injectable, Logger } from '@nestjs/common';
import { SwapResponseDto } from '../dto/swap.dto';
import { CryptoService } from './crypto.service';

@Injectable()
export class SwapService {
  private readonly logger = new Logger(SwapService.name);
  private readonly FEE_PERCENTAGE = 0.03; // 0.03%

  constructor(private readonly cryptoService: CryptoService) {}

  async calculateEthToBtc(ethAmount: number): Promise<SwapResponseDto> {
    try {
      // In a real application, we would fetch these from an exchange API
      const ethPrice = await this.cryptoService.getEthereumPrice();
      const btcPrice = 65000; // Example BTC price, should be fetched from API

      // Calculate ETH value in USD
      const ethValue = ethAmount * ethPrice;
      
      // Calculate fee
      const feeEth = ethAmount * (this.FEE_PERCENTAGE / 100);
      const feeUsd = feeEth * ethPrice;

      // Calculate BTC amount after fee
      const btcAmount = (ethValue - feeUsd) / btcPrice;

      return {
        btcAmount,
        ethFee: feeEth,
        usdFee: feeUsd,
      };
    } catch (error) {
      this.logger.error(`Failed to calculate swap rate: ${error.message}`);
      throw error;
    }
  }
} 