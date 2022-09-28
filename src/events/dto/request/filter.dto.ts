import { IsOptional, IsString } from 'class-validator';

export class FilterEventDto {
  @IsOptional()
  @IsString()
  category?: string;
}
