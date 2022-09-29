import { UserRole } from '@prisma/client';
import { Type } from 'class-transformer';
import { RetrieveEventDto } from 'src/events/dto/response/retrieve.dto';

export class RetrieveUserDto {
  uuid: string;

  email: string;

  firstName: string;

  lastName: string;

  role: UserRole;

  @Type(() => RetrieveEventDto)
  likedEvents: RetrieveEventDto[];
}
