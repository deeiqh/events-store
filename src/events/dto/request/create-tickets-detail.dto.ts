import { Currency, EventZone } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateTicketsDetailDto {
  @IsUUID()
  eventId: string;

  @IsInt()
  @Min(1)
  nominalPrice: number;

  @IsInt()
  @Min(0)
  ticketsAvailable: number;

  @IsOptional()
  @IsEnum(EventZone)
  zone?: EventZone;

  @IsOptional()
  @IsInt()
  @Min(1)
  ticketsPerPerson?: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
