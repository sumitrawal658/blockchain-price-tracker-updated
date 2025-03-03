import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class SwapQueryDto {
  @ApiProperty({
    description: 'Amount of ETH to swap',
    example: 1.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class SwapResponseDto {
  @ApiProperty({
    description: 'Amount of BTC to receive',
    example: 0.0589,
  })
  btcAmount: number;

  @ApiProperty({
    description: 'Fee in ETH',
    example: 0.00045,
  })
  ethFee: number;

  @ApiProperty({
    description: 'Fee in USD',
    example: 1.23,
  })
  usdFee: number;
} 