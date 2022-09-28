import { EventZone } from '@prisma/client';
import { Currency } from '@prisma/client';
import { Transform } from 'class-transformer';
import { RetrieveEventDto } from 'src/events/dto/response/retrieve.dto';

export class RetrieveTicketsDetailDto {
  nominal_price: number;

  tickets_available: number;

  zone: EventZone;

  tickets_per_person: number;

  currency: Currency;

  @Transform(({ value }) => value?.toISOString())
  updated_at: Date;

  event_id: string;
}
