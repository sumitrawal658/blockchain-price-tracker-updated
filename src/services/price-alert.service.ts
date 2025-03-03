import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { PriceAlert } from '../entities/price-alert.entity';
import { CreatePriceAlertDto } from '../dto/price-alert.dto';
import { CryptoService } from './crypto.service';
import { EmailService } from './email.service';

@Injectable()
export class PriceAlertService {
  private readonly logger = new Logger(PriceAlertService.name);

  constructor(
    @InjectRepository(PriceAlert)
    private priceAlertRepository: Repository<PriceAlert>,
    private cryptoService: CryptoService,
    private emailService: EmailService,
  ) {}

  async createAlert(createAlertDto: CreatePriceAlertDto): Promise<PriceAlert> {
    const alert = this.priceAlertRepository.create(createAlertDto);
    return this.priceAlertRepository.save(alert);
  }

  async findAll(): Promise<PriceAlert[]> {
    return this.priceAlertRepository.find();
  }

  @Cron('* * * * *') // Check every minute
  async checkPriceAlerts() {
    try {
      const alerts = await this.priceAlertRepository.find({
        where: { isTriggered: false },
      });

      for (const alert of alerts) {
        const currentPrice = alert.cryptocurrency === 'ethereum'
          ? await this.cryptoService.getEthereumPrice()
          : await this.cryptoService.getPolygonPrice();

        if (this.shouldTriggerAlert(alert, currentPrice)) {
          await this.triggerAlert(alert, currentPrice);
        }
      }
    } catch (error) {
      this.logger.error('Failed to check price alerts:', error);
    }
  }

  private shouldTriggerAlert(alert: PriceAlert, currentPrice: number): boolean {
    // Trigger if price crosses target price in either direction
    return (currentPrice >= alert.targetPrice);
  }

  private async triggerAlert(alert: PriceAlert, currentPrice: number) {
    try {
      await this.emailService.sendCustomPriceAlert(
        alert.email,
        alert.cryptocurrency,
        alert.targetPrice,
        currentPrice,
      );

      // Mark alert as triggered
      alert.isTriggered = true;
      await this.priceAlertRepository.save(alert);

      this.logger.log(`Triggered alert for ${alert.cryptocurrency} at price ${currentPrice}`);
    } catch (error) {
      this.logger.error(`Failed to trigger alert: ${error.message}`);
      throw error;
    }
  }
} 