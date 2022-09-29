import { Currency } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateTicketDto {
  @IsUUID()
  ticketsDetailId: string;

  @IsOptional()
  discounts?: object; // [{description: "without discount", percentage: 0, amount: 0}]

  @IsInt()
  @Min(1)
  finalPrice: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  ticketsToBuy?: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
