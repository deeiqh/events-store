import {
  IsDate,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import { RetrieveTicketsDetailDto } from '../response/retrieve-tickets-detail.dto';

export class UpdateEventDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  place?: string;

  @IsJSON()
  @IsOptional()
  image?: object;
}
