import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/request/update.dto';
import { RetrieveUserDto } from './dto/response/retrieve.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(userId: string): Promise<RetrieveUserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        uuid: userId,
      },
    });
    return plainToInstance(RetrieveUserDto, user);
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<RetrieveUserDto> {
    const user = await this.prisma.user.update({
      where: {
        uuid: userId,
      },
      data: {
        ...updateUserDto,
      },
    });
    return plainToInstance(RetrieveUserDto, user);
  }
}
