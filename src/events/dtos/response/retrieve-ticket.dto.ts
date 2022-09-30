import { Currency, TicketStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { RetrieveTicketsDetailDto } from 'src/events/dtos/response/retrieve-tickets-detail.dto';

export class RetrieveTicketDto {
  uuid: string;

  discounts?: object; // [{description: "without discount", percentage: 0, amount: 0}]

  finalPrice: number;

  ticketsToBuy: number;

  currency: Currency;

  status: TicketStatus;

  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;

  @Type(() => RetrieveTicketsDetailDto)
  ticketsDetail: RetrieveTicketsDetailDto;
}
