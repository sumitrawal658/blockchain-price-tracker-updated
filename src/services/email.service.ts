import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPriceAlert(cryptocurrency: string, price: number, percentageIncrease: number) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'hyperhire_assignment@hyperhire.in',
        subject: `Price Alert: ${cryptocurrency.toUpperCase()} Price Increase`,
        html: `
          <h2>Cryptocurrency Price Alert</h2>
          <p>The price of ${cryptocurrency.toUpperCase()} has increased significantly:</p>
          <ul>
            <li>Current Price: $${price.toFixed(2)}</li>
            <li>Increase: ${percentageIncrease.toFixed(2)}%</li>
          </ul>
          <p>This alert was generated automatically by the price tracking system.</p>
        `,
      });
      this.logger.log(`Price alert email sent for ${cryptocurrency}`);
    } catch (error) {
      this.logger.error('Failed to send price alert email:', error);
      throw error;
    }
  }

  async sendCustomPriceAlert(email: string, cryptocurrency: string, targetPrice: number, currentPrice: number) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: `Target Price Reached: ${cryptocurrency.toUpperCase()}`,
        html: `
          <h2>Price Target Alert</h2>
          <p>Your target price for ${cryptocurrency.toUpperCase()} has been reached:</p>
          <ul>
            <li>Target Price: $${targetPrice.toFixed(2)}</li>
            <li>Current Price: $${currentPrice.toFixed(2)}</li>
          </ul>
          <p>This is an automated notification from your price alert settings.</p>
        `,
      });
      this.logger.log(`Custom price alert email sent to ${email} for ${cryptocurrency}`);
    } catch (error) {
      this.logger.error('Failed to send custom price alert email:', error);
      throw error;
    }
  }
} 