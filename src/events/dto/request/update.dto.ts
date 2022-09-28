import {
  IsDate,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EventCategory } from '@prisma/client';

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

  @IsUUID()
  @IsOptional()
  tickets_detail_id?: string;

  @IsJSON()
  @IsOptional()
  image?: object;
}
