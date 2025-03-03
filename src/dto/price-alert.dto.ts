import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEmail, IsIn } from 'class-validator';

export class CreatePriceAlertDto {
  @ApiProperty({
    description: 'Cryptocurrency to track (ethereum or polygon)',
    example: 'ethereum',
  })
  @IsString()
  @IsIn(['ethereum', 'polygon'])
  cryptocurrency: string;

  @ApiProperty({
    description: 'Target price in USD',
    example: 2000,
  })
  @IsNumber()
  targetPrice: number;

  @ApiProperty({
    description: 'Email address to receive alerts',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
} 