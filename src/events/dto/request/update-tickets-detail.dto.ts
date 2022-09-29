import { Currency, EventZone } from '@prisma/client';
import { IsEnum, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class updateTicketsDetailDto {
  @IsUUID()
  @IsOptional()
  event_id?: string;

  @IsPositive()
  @IsOptional()
  nominal_price?: number;

  @IsPositive()
  @IsOptional()
  tickets_available?: number;

  @IsEnum(EventZone)
  @IsOptional()
  zone?: EventZone;

  @IsPositive()
  @IsOptional()
  tickets_per_person?: number;

  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;
}
