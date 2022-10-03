import { Currency } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty()
  @IsUUID()
  ticketsDetailId: string;

  @ApiProperty()
  @IsOptional()
  discounts?: object; // [{description: "without discount", percentage: 0, amount: 0}]

  @ApiProperty()
  @IsInt()
  @Min(1)
  finalPrice: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  ticketsToBuy?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
