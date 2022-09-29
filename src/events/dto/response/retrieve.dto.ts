import { Transform, Type } from 'class-transformer';
import { RetrieveTicketsDetailDto } from './retrieve-tickets-detail.dto';
import { RetrieveUserDto } from 'src/users/dto/response/retrieve.dto';

export class RetrieveEventDto {
  uuid: string;

  title: string;

  description: string;

  category: string;

  @Transform(({ value }) => value?.toISOString())
  date: Date;

  place: string;

  image: JSON;

  user: RetrieveUserDto;

  likesNumber: number;

  status: string;

  @Transform(({ value }) => value?.toISOString())
  createdAt: Date;

  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;

  @Type(() => RetrieveTicketsDetailDto)
  ticketsDetail: RetrieveTicketsDetailDto[];

  @Type(() => RetrieveUserDto)
  likes: RetrieveUserDto[];
}
