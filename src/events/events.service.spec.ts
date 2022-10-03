import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFactory } from 'src/utils/factories/user.factory';
import { clearDatabase } from 'src/utils/prisma/prisma.util';
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

    it('should thorw an error if wrong category', async () => {
      await expect(service.getEvents('CULTURE')).rejects.toThrow(
        new NotFoundException('Category not found'),
      );
    });

    it("shouldn't do pagination if take parameter is not provided", async () => {
      const event = await eventFactory.make();
      const result = await service.getEvents('MUSIC');
      expect(result).toHaveProperty('events', [{ ...event }]);
      expect(result).toHaveProperty('pagination', {
        take: undefined,
        cursor: undefined,
      });
    });

    it('should start from first record if cursor is not provided', async () => {
      const event = await eventFactory.make();
      const take = 3;

      const result = await service.getEvents('MUSIC', take);

      expect(result).toHaveProperty('events', [{ ...event }]);
      expect(result).toHaveProperty('pagination', {
        take: 3,
        cursor: result.pagination.cursor,
      });
    });

    it('should start from cursor if provided taken and cursor', async () => {
      const event = await eventFactory.make();
      const take = 3;
      const cursor = await (
        await service.getEvents('MUSIC', take)
      ).pagination.cursor;

      const result = await service.getEvents('MUSIC', take, cursor);

      expect(result).toHaveProperty('events', [{ ...event }]);
      expect(result).toHaveProperty('pagination', {
        take: 3,
        cursor: result.pagination.cursor,
      });
    });

    it('should return remaining events if take is bigger, without new cursor', async () => {
      const event = await eventFactory.make();
      const take = 13;

      const result = await service.getEvents('MUSIC', take);

      expect(result).toHaveProperty('events', [{ ...event }]);
      expect(result).toHaveProperty('pagination', {
        take: 13,
        cursor: undefined,
      });
    });
  });
});
