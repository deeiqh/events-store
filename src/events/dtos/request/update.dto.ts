import {
  IsDateString,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventCategory } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  date?: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  place?: string;

  @ApiProperty()
  @IsJSON()
  @IsOptional()
  image?: object;
}
