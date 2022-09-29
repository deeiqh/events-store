import { Currency, TicketStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsJSON,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsUUID()
  ticketsDetailId?: string;

  @IsOptional()
  @IsJSON()
  discounts?: object; // [{description: "without discount", percentage: 0, amount: 0}]

  @IsOptional()
  @IsInt()
  @Min(1)
  finalPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  ticketsToBuy?: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}
