import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('price_alerts')
export class PriceAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cryptocurrency: string;

  @Column('decimal', { precision: 18, scale: 8 })
  targetPrice: number;

  @Column()
  email: string;

  @Column({ default: false })
  isTriggered: boolean;
} 