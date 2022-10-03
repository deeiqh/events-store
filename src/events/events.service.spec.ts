import { NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFactory } from 'src/utils/factories/user.factory';
import { clearDatabase } from 'src/utils/prisma/prisma.util';
import { EventsService } from './events.service';
import { EventFactory } from 'src/utils/factories/event.factory';
import { faker } from '@faker-js/faker';
import { UpdateEventDto } from './dtos/request/update.dto';
import { TicketsDetailFactory } from 'src/utils/factories/tickets-detail.factory';
import { Currency, OrderStatus } from '@prisma/client';
import { OrderFactory } from 'src/utils/factories/order.factory';
import { CreateTicketDto } from './dtos/request/create-ticket.dto';
import { TicketFactory } from 'src/utils/factories/ticket.factory';

describe('EventsService', () => {
  let prisma: PrismaService;
  let service: EventsService;
  let userFactory: UserFactory;
  let eventFactory: EventFactory;
  let ticketsDetailFactory: TicketsDetailFactory;
  let orderFactory: OrderFactory;
  let ticketFactory: TicketFactory;

  beforeAll(async () => {
    userFactory = new UserFactory();
    eventFactory = new EventFactory();
    ticketsDetailFactory = new TicketsDetailFactory();
    orderFactory = new OrderFactory();
    ticketFactory = new TicketFactory();
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

  describe('createEvent', () => {
    it('should create the event for the user', async () => {
      const { uuid } = await userFactory.make();
      const event = await eventFactory.make();

      const newEvent = await service.createEvent(event, uuid);

      expect(newEvent).toHaveProperty('uuid');
      expect(newEvent).toHaveProperty('title', event.title);
    });
  });

  describe('getEvent', () => {
    it('should throw error if event not found', async () => {
      await expect(
        service.getEvent(faker.datatype.uuid()),
      ).rejects.toThrowError(new NotFoundException('Event not found'));
    });

    it('should retrieve event if event exists', async () => {
      const { uuid, title } = await eventFactory.make();

      const event = await service.getEvent(uuid);

      expect(event).toHaveProperty('uuid', uuid);
      expect(event).toHaveProperty('title', title);
    });
  });

  describe('updateEvent', () => {
    it('should update the event', async () => {
      const { uuid, ...eventData } = await eventFactory.make();

      const result = await service.updateEvent(
        uuid,
        eventData as UpdateEventDto,
      );

      expect(result).toHaveProperty('uuid', uuid);
      expect(result).toHaveProperty('title', eventData.title);
    });
  });

  describe('deleteEvent', () => {
    it('should delete the event', async () => {
      const { uuid } = await eventFactory.make();
      const event = await service.deleteEvent(uuid);
      expect(event.deletedAt).not.toEqual(null);
    });
  });

  describe('addToCart', () => {
    let eventId: string;
    let ticketsDetailId: string;
    let userId: string;
    let ticketData: CreateTicketDto;

    beforeEach(async () => {
      eventId = (await eventFactory.make()).uuid;
      ticketsDetailId = (
        await ticketsDetailFactory.make({
          eventId,
        })
      ).uuid;
      ticketData = {
        ticketsDetailId,
        finalPrice: faker.datatype.number(),
        ticketsToBuy: faker.datatype.number(),
        currency:
          Object.values(Currency)[
            Math.floor(Math.random() * Object.values(Currency).length)
          ],
      };

      userId = (await userFactory.make()).uuid;
    });

    it('should throw an error if more than one cart found', async () => {
      await orderFactory.make({ userId, status: 'CART' });
      await orderFactory.make({ userId, status: 'CART' });

      await expect(
        service.addToCart(eventId, userId, ticketData),
      ).rejects.toThrowError(
        new PreconditionFailedException('More than one cart found'),
      );
    });

    it('should select current CART order if one is found', async () => {
      const orderId = await orderFactory.make({ userId, status: 'CART' });
      const result = await service.addToCart(eventId, userId, ticketData);
      expect(result).toHaveProperty('orderId', orderId);
    });

    it('should creat new CART order if no one is found', async () => {
      const result = await service.addToCart(eventId, userId, ticketData);
      expect(result).toHaveProperty('orderId');
    });
  });

  describe('buyCart', async () => {
    it('should change the order status from CART to CLOSED', async () => {
      const { uuid: userId } = await userFactory.make();
      const { uuid: orderId } = await orderFactory.make({
        userId,
        status: 'CART',
      });

      const result = await service.buyCart(orderId);

      expect(result).toHaveProperty('status', OrderStatus.CLOSED);
    });
  });

  describe('getTicketsDetails', () => {
    it('should retrieve tickets details info', async () => {
      const { uuid: eventId } = await eventFactory.make();
      await ticketsDetailFactory.make({ eventId });

      const result = await service.getTicketsDetails(eventId);

      expect(result).toHaveProperty('length');
      if (result.length) {
        expect(result[0]).toHaveProperty('zone');
      }
    });
  });

  describe('createTicketsDetail', async () => {
    it('should create tickets detail for an event', async () => {
      const { uuid: eventId } = await eventFactory.make();
      const ticketDetailInfo = await ticketsDetailFactory.make({ eventId });

      const result = await service.createTicketsDetail(
        eventId,
        ticketDetailInfo,
      );

      expect(result).toHaveProperty('zone', ticketDetailInfo.zone);
    });
  });

  describe('getTicketsDetail', () => {
    it('should retrieve tickets detail info', async () => {
      const { uuid: eventId } = await eventFactory.make();
      await ticketsDetailFactory.make({ eventId });

      const result = await service.getTicketsDetail(eventId);

      expect(result).toHaveProperty('zone');
    });
  });

  describe('updateTicketsDetail', async () => {
    it('should update tickets detail for an event', async () => {
      const { uuid: eventId } = await eventFactory.make();
      const { uuid } = await ticketsDetailFactory.make({
        eventId,
      });

      const price = faker.datatype.number();
      const result = await service.updateTicketsDetail(uuid, {
        nominalPrice: price,
      });

      expect(result).toHaveProperty('nominalPrice', price);
    });
  });

  describe('deleteTicketsDetail', async () => {
    it('should delete tickets detail for an event', async () => {
      const { uuid: eventId } = await eventFactory.make();
      const { uuid } = await ticketsDetailFactory.make({
        eventId,
      });

      const result = await service.deleteTicketsDetail(uuid);

      expect(result.deletedAt).not.toEqual(null);
    });
  });

  describe('getTickets', () => {
    it('should retrieve tickets', async () => {
      const { uuid: userId } = await userFactory.make();
      const { uuid: eventId } = await eventFactory.make({ userId });
      const { uuid: orderId } = await orderFactory.make({
        userId,
        status: 'CART',
      });
      const { uuid: ticketsDetailId } = await ticketsDetailFactory.make({
        eventId,
      });
      await ticketFactory.make({ ticketsDetailId, orderId, eventId });

      const result = await service.getTickets(eventId);

      expect(result).toHaveProperty('length');
      if (result.length) {
        expect(result[0]).toHaveProperty('finalPrice');
      }
    });
  });

  describe('likeOrDislikeEvent', () => {
    it('should throw error if user not found', async () => {
      const { uuid: userId } = await userFactory.make();
      const eventId = faker.datatype.uuid();
      await expect(
        service.likeOrDislikeEvent(userId, eventId),
      ).rejects.toThrowError(new NotFoundException('Not found'));
    });

    it('should give a like if user has not liked event before', async () => {
      const { uuid: userId } = await userFactory.make();
      const { uuid: eventId } = await eventFactory.make({ userId });

      await service.likeOrDislikeEvent(userId, eventId);
      const result = await prisma.event.findUnique({
        where: {
          uuid: eventId,
        },
        select: {
          likes: {
            where: {
              uuid: userId,
            },
          },
        },
      });

      expect(result?.likes[0].uuid).toBe(userId);
    });

    it('should remove a like if user has liked event before', async () => {
      const { uuid: userId } = await userFactory.make();
      const { uuid: eventId } = await eventFactory.make({ userId });

      await service.likeOrDislikeEvent(userId, eventId);
      await service.likeOrDislikeEvent(userId, eventId);

      const result = await prisma.event.findUnique({
        where: {
          uuid: eventId,
        },
        select: {
          likes: {
            where: {
              uuid: userId,
            },
          },
        },
      });

      expect(result?.likes).toEqual(expect.arrayContaining([]));
    });
  });

  describe('getLikes', () => {
    it('should throw an error if event not found', async () => {
      const eventId = faker.datatype.uuid();

      await expect(service.getLikes(eventId)).rejects.toThrowError(
        new NotFoundException('Event not found'),
      );
    });

    it('should get likes given to event', async () => {
      const { uuid: userId } = await userFactory.make();
      const { uuid: eventId } = await eventFactory.make({ userId });
      await service.likeOrDislikeEvent(userId, eventId);

      const result = await service.getLikes(eventId);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('firstName');
    });
  });

  describe('uploadImage', async () => {
    it('should upload an image to an event', async () => {
      const { uuid: userId } = await userFactory.make();
      const { uuid: eventId } = await eventFactory.make({ userId });
      const imageUrl = await fetch(faker.image.abstract());
      const imageBuffer = Buffer.from(await imageUrl.arrayBuffer());
      const fileName = faker.word.noun();

      const event = await service.uploadImage(eventId, imageBuffer, fileName);

      expect(event).toHaveProperty('image');
      expect(event.image).toHaveProperty('url');
      expect(event.image).toHaveProperty('key');
    });
  });
});
