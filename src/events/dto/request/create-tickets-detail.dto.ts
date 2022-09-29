import { Currency, EventZone } from '@prisma/client';
import { IsEnum, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateTicketsDetailDto {
  @IsUUID()
  event_id: string;

  @IsPositive()
  nominal_price: number;

  @IsPositive()
  tickets_available: number;

  @IsOptional()
  @IsEnum(EventZone)
  zone?: EventZone;

  @IsOptional()
  tickets_per_person?: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
