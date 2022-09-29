import { IsDate, IsEnum, IsJSON, IsNotEmpty, IsString } from 'class-validator';
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

  @IsJSON()
  image: object;
}
