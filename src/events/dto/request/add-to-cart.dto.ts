import { Currency } from '@prisma/client';
import { IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  tickets_detail_id: string;

  @IsOptional()
  discounts?: object; // [{description: "without discount", percentage: 0, amount: 0}]

  @IsPositive()
  final_price: number;

  @IsUUID()
  user_id: string;

  @IsUUID()
  order_id: string;

  @IsPositive()
  @IsOptional()
  tickets_to_buy?: number;

  @IsOptional()
  @IsOptional()
  currency?: Currency;
}
