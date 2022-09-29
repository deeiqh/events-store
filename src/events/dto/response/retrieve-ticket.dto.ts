import { Currency, TicketStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { RetrieveTicketsDetailDto } from 'src/events/dto/response/retrieve-tickets-detail.dto';
import { RetrieveEventDto } from 'src/events/dto/response/retrieve.dto';

export class RetrieveTicketDto {
  discounts?: object; // [{description: "without discount", percentage: 0, amount: 0}]

  final_price: number;

  tickets_to_buy: number;

  currency: Currency;

  status: TicketStatus;

  @Transform(({ value }) => value?.toISOString())
  updated_at: Date;

  @Type(() => RetrieveTicketsDetailDto)
  tickets_detail: RetrieveTicketsDetailDto;
}
