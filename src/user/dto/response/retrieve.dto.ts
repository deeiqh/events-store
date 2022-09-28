import { UserRole } from '@prisma/client';
import { RetrieveEventDto } from 'src/events/dto/response/retrieve.dto';

export class RetrieveUserDto {
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  liked_events: RetrieveEventDto[];
}
