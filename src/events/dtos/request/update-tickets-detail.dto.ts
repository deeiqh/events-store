import { Currency, EventZone } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class updateTicketsDetailDto {
  @IsUUID()
  @IsOptional()
  eventId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  nominalPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  ticketsAvailable?: number;

  @IsEnum(EventZone)
  @IsOptional()
  zone?: EventZone;

  @IsOptional()
  @IsInt()
  @Min(1)
  ticketsPerPerson?: number;

  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;
}
