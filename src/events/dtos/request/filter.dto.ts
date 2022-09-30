import { EventCategory } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class FilterEventDto {
  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;
}
