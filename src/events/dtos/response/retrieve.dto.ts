import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RetrieveTicketsDetailDto } from './retrieve-tickets-detail.dto';
import { RetrieveUserDto } from 'src/users/dtos/response/retrieve.dto';

export class RetrieveEventDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  @Transform(({ value }) => value?.toISOString())
  date: Date;

  @ApiProperty()
  place: string;

  @ApiProperty()
  image: object;

  @ApiProperty()
  user: RetrieveUserDto;

  @ApiProperty()
  likesNumber: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  @Transform(({ value }) => value?.toISOString())
  createdAt: Date;

  @ApiProperty()
  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;

  @ApiProperty()
  @Type(() => RetrieveTicketsDetailDto)
  ticketsDetail: RetrieveTicketsDetailDto[];

  @ApiProperty()
  @Type(() => RetrieveUserDto)
  likes: RetrieveUserDto[];

  @ApiProperty()
  @Transform(({ value }) => value?.toISOString())
  deletedAt: Date;
}
