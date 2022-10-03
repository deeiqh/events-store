import { Currency, OrderStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RetrieveUserDto } from 'src/users/dtos/response/retrieve.dto';
import { RetrieveTicketDto } from './retrieve-ticket.dto';

export class RetrieveOrderDto {
  @ApiProperty()
  uuid: string;

  discounts: object; // [{description: "without discount", percentage: 0, amount: 0}]

  @ApiProperty()
  finalPrice: number;

  @ApiProperty()
  status: OrderStatus;

  @ApiProperty()
  currency: Currency;

  @ApiProperty()
  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;

  @ApiProperty()
  @Type(() => RetrieveTicketDto)
  tickets: RetrieveTicketDto[];

  @ApiProperty()
  @Type(() => RetrieveUserDto)
  user: RetrieveUserDto;

  @ApiProperty()
  @Transform(({ value }) => value?.toISOString())
  deletedAt: Date;
}
