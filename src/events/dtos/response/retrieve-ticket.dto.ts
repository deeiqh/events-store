import { Currency, TicketStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RetrieveTicketsDetailDto } from 'src/events/dtos/response/retrieve-tickets-detail.dto';

export class RetrieveTicketDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  discounts?: object; // [{description: "without discount", percentage: 0, amount: 0}]

  @ApiProperty()
  finalPrice: number;

  @ApiProperty()
  ticketsToBuy: number;

  @ApiProperty()
  currency: Currency;

  @ApiProperty()
  status: TicketStatus;

  @ApiProperty()
  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;

  @ApiProperty()
  @Type(() => RetrieveTicketsDetailDto)
  ticketsDetail: RetrieveTicketsDetailDto;

  @ApiProperty()
  @Transform(({ value }) => value?.toISOString())
  deletedAt: Date;
}
