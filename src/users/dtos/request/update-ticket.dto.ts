import { Currency, TicketStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsJSON,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTicketDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  ticketsDetailId?: string;

  @ApiProperty()
  @IsOptional()
  @IsJSON()
  discounts?: object; // [{description: "without discount", percentage: 0, amount: 0}]

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  finalPrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  ticketsToBuy?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}
