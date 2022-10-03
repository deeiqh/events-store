import { UserRole } from '@prisma/client';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RetrieveEventDto } from 'src/events/dtos/response/retrieve.dto';

export class RetrieveUserDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  @Type(() => RetrieveEventDto)
  likedEvents: RetrieveEventDto[];
}
