import { Transform, Type } from 'class-transformer';
import { RetrieveTicketsDetailDto } from './retrieve-tickets-detail.dto';
import { RetrieveUserDto } from 'src/users/dto/response/retrieve.dto';

export class RetrieveEventDto {
  title: string;

  description: string;

  category: string;

  @Transform(({ value }) => value?.toISOString())
  date: Date;

  place: string;

  image: JSON;

  user: RetrieveUserDto;

  likes_number: number;

  status: string;

  @Transform(({ value }) => value?.toISOString())
  created_at: Date;

  @Transform(({ value }) => value?.toISOString())
  updated_at: Date;

  @Type(() => RetrieveTicketsDetailDto)
  tickets_detail: RetrieveTicketsDetailDto[];

  @Type(() => RetrieveUserDto)
  likes: RetrieveUserDto[];
}
