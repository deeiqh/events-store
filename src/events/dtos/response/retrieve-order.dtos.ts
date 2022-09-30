import { Currency, OrderStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { RetrieveUserDto } from 'src/users/dtos/response/retrieve.dto';
import { RetrieveTicketDto } from './retrieve-ticket.dto';

export class RetrieveOrderDto {
  uuid: string;

  discounts: object; // [{description: "without discount", percentage: 0, amount: 0}]

  finalPrice: number;

  status: OrderStatus;

  currency: Currency;

  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;

  @Type(() => RetrieveTicketDto)
  tickets: RetrieveTicketDto[];

  @Type(() => RetrieveUserDto)
  user: RetrieveUserDto;
}
