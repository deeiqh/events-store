import { IsDate, IsEnum, IsJSON, IsNotEmpty, IsString } from 'class-validator';
import { EventCategory } from '@prisma/client';
import { RetrieveTicketsDetailDto } from '../response/retrieve-tickets-detail.dto';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(EventCategory)
  category: EventCategory;

  @IsDate()
  date: Date;

  @IsString()
  @IsNotEmpty()
  place: string;

  @IsJSON()
  image: object;
}
