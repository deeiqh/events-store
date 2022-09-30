import { EventZone } from '@prisma/client';
import { Currency } from '@prisma/client';
import { Transform } from 'class-transformer';

export class RetrieveTicketsDetailDto {
  uuid: string;

  nominalPrice: number;

  ticketsAvailable: number;

  zone: EventZone;

  ticketsPerPerson: number;

  currency: Currency;

  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;

  eventId: string;
}
