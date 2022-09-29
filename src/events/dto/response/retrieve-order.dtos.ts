import { Currency, OrderStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { RetrieveUserDto } from 'src/users/dto/response/retrieve.dto';
import { RetrieveTicketDto } from './retrieve-ticket.dto';

export class RetrieveOrderDto {
  discounts: object; // [{description: "without discount", percentage: 0, amount: 0}]

  final_price: number;

  status: OrderStatus;

  currency: Currency;

  @Transform(({ value }) => value?.toISOString())
  updated_at: Date;

  @Type(() => RetrieveTicketDto)
  tickets: RetrieveTicketDto[];

  @Type(() => RetrieveUserDto)
  user: RetrieveUserDto;
}
