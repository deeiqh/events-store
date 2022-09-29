import { UserRole } from '@prisma/client';
import { Type } from 'class-transformer';
import { RetrieveEventDto } from 'src/events/dto/response/retrieve.dto';

export class RetrieveUserDto {
  uuid: string;

  email: string;

  first_name: string;

  last_name: string;

  role: UserRole;

  @Type(() => RetrieveEventDto)
  liked_events: RetrieveEventDto[];
}
