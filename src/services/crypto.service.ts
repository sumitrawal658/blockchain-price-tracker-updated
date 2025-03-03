import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Price } from '../entities/price.entity';
import { EmailService } from './email.service';
import Moralis from 'moralis';

@Injectable()
export class CryptoService implements OnModuleInit {
  private readonly logger = new Logger(CryptoService.name);

  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    private emailService: EmailService,
  ) {}

  async onModuleInit() {
    if (!process.env.MORALIS_API_KEY) {
      throw new Error('MORALIS_API_KEY is not set');
    }
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });
  }

  @Cron('*/5 * * * *') // Run every 5 minutes
  async trackPrices() {
    try {
      const ethPrice = await this.getEthereumPrice();
      const polygonPrice = await this.getPolygonPrice();

      await Promise.all([
        this.savePriceToDb('ethereum', ethPrice),
        this.savePriceToDb('polygon', polygonPrice),
      ]);

      await this.checkPriceIncrease();
    } catch (error) {
      this.logger.error('Error tracking prices:', error);
    }
  }

  private async savePriceToDb(cryptocurrency: string, price: number) {
    const priceEntity = this.priceRepository.create({
      cryptocurrency,
      price,
    });
    await this.priceRepository.save(priceEntity);
  }

  private async checkPriceIncrease() {
    const cryptocurrencies = ['ethereum', 'polygon'];

    for (const crypto of cryptocurrencies) {
      const currentPrice = await this.getCurrentPrice(crypto);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      const oldPrice = await this.priceRepository.findOne({
        where: {
          cryptocurrency: crypto,
          timestamp: LessThanOrEqual(oneHourAgo),
        },
        order: { timestamp: 'DESC' },
      });

      if (oldPrice) {
        const priceIncrease = ((currentPrice - oldPrice.price) / oldPrice.price) * 100;

        if (priceIncrease >= 3) {
          await this.emailService.sendPriceAlert(crypto, currentPrice, priceIncrease);
        }
      }
    }
  }

  private async getCurrentPrice(cryptocurrency: string): Promise<number> {
    const latestPrice = await this.priceRepository.findOne({
      where: { cryptocurrency },
      order: { timestamp: 'DESC' },
    });
    return latestPrice ? latestPrice.price : 0;
  }

  async getEthereumPrice(): Promise<number> {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH contract address
        chain: '0x1', // Ethereum mainnet
      });
      
      const price = response.raw.usdPrice;
      this.logger.log(`Current ETH price: $${price}`);
      return price;
    } catch (error) {
      this.logger.error('Failed to fetch Ethereum price:', error);
      throw error;
    }
  }

  async getPolygonPrice(): Promise<number> {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC contract address
        chain: '0x89', // Polygon mainnet
      });
      
      const price = response.raw.usdPrice;
      this.logger.log(`Current MATIC price: $${price}`);
      return price;
    } catch (error) {
      this.logger.error('Failed to fetch Polygon price:', error);
      throw error;
    }
  }

  async getPriceHistory(cryptocurrency: string) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return this.priceRepository.find({
      where: {
        cryptocurrency,
        timestamp: MoreThanOrEqual(twentyFourHoursAgo),
      },
      order: {
        timestamp: 'ASC',
      },
    });
  }
} 