import { faker } from '@faker-js/faker';
import {
  BadRequestException,
  NotFoundException,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenActivity } from 'src/utils/enums/prisma-enums';
import { TokenFactory } from 'src/utils/factories/token.factory';
import { UserFactory } from 'src/utils/factories/user.factory';
import { clearDatabase } from 'src/utils/prisma/prisma.util';
import { RegisterDto } from './dtos/request/register.dto';
import { SignInDto } from './dtos/request/signIn.dto';
import { TokenService } from './token.service';
import { EventsService } from './events.service';
import { EventFactory } from 'src/utils/factories/event.factory';

describe('EventsService', () => {
  let prisma: PrismaService;
  let service: EventsService;
  let userFactory: UserFactory;
  let eventFactory: EventFactory;

  beforeAll(async () => {
    userFactory = new UserFactory();
    eventFactory = new EventFactory();
  });

  afterAll(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsService],
    }).compile();

    service = module.get<EventsService>(EventsService);

    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    it('should throw an error if category not found', async () => {
      await expect(service.getEvents('musicTheater')).rejects.toThrow(
        new NotFoundException('Category not found'),
      );
    });
  });
});
