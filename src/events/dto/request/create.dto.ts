import {
  IsDate,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { EventCategory } from '@prisma/client';

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

  @IsUUID()
  tickets_detail_id: string;

  @IsJSON()
  image: object;
}
