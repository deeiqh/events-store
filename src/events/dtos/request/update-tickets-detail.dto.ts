import { Currency, EventZone } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class updateTicketsDetailDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  eventId?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  nominalPrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  ticketsAvailable?: number;

  @ApiProperty()
  @IsEnum(EventZone)
  @IsOptional()
  zone?: EventZone;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  ticketsPerPerson?: number;

  @ApiProperty()
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;
}
