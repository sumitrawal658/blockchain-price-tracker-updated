import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { databaseConfig } from './config/database.config';
import { PricesController } from './controllers/prices.controller';
import { AlertsController } from './controllers/alerts.controller';
import { SwapController } from './controllers/swap.controller';
import { CryptoService } from './services/crypto.service';
import { SwapService } from './services/swap.service';
import { PriceAlertService } from './services/price-alert.service';
import { EmailModule } from './modules/email.module';
import { Price } from './entities/price.entity';
import { PriceAlert } from './entities/price-alert.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Price, PriceAlert]),
    ScheduleModule.forRoot(),
    EmailModule,
  ],
  controllers: [PricesController, AlertsController, SwapController],
  providers: [CryptoService, SwapService, PriceAlertService],
})
export class AppModule {}
