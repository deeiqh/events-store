import { Currency, EventZone } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketsDetailDto {
  @ApiProperty()
  @IsUUID()
  eventId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  nominalPrice: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  ticketsAvailable: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(EventZone)
  zone?: EventZone;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  ticketsPerPerson?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
