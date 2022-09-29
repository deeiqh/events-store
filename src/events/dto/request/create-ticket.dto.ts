import { Currency } from '@prisma/client';
import { IsEnum, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @IsUUID()
  tickets_detail_id: string;

  @IsOptional()
  discounts?: object; // [{description: "without discount", percentage: 0, amount: 0}]

  @IsPositive()
  final_price: number;

  @IsPositive()
  @IsOptional()
  tickets_to_buy?: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
