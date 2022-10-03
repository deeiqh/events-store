import { EventZone } from '@prisma/client';
import { Currency } from '@prisma/client';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RetrieveTicketsDetailDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  nominalPrice: number;

  @ApiProperty()
  ticketsAvailable: number;

  @ApiProperty()
  zone: EventZone;

  @ApiProperty()
  ticketsPerPerson: number;

  @ApiProperty()
  currency: Currency;

  @ApiProperty()
  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;

  @ApiProperty()
  eventId: string;

  @ApiProperty()
  @Transform(({ value }) => value?.toISOString())
  deletedAt: Date;
}
