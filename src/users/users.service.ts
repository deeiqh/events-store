import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { OrderStatus, TicketStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { RetrieveOrderDto } from 'src/events/dtos/response/retrieve-order.dtos';
import { RetrieveTicketDto } from 'src/events/dtos/response/retrieve-ticket.dto';
import { RetrieveEventDto } from 'src/events/dtos/response/retrieve.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTicketDto } from './dtos/request/update-ticket.dto';
import { UpdateUserDto } from './dtos/request/update.dto';
import { RetrieveUserDto } from './dtos/response/retrieve.dto';

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

  async getCart(userId: string): Promise<RetrieveOrderDto> {
    const cart = await this.prisma.order.findMany({
      where: {
        userId,
        status: OrderStatus.CART,
        deletedAt: null,
        tickets: {
          some: {
            deletedAt: null,
            status: TicketStatus.RESERVED,
          },
        },
      },
    });

    if (cart.length > 1) {
      throw new PreconditionFailedException('More than one cart found');
    }

    if (!cart.length) {
      return plainToInstance(RetrieveOrderDto, {});
    }

    return plainToInstance(RetrieveOrderDto, cart[0]);
  }

  async updateTicket(
    ticketId: string,
    updateTicketDto: UpdateTicketDto,
  ): Promise<RetrieveTicketDto> {
    const ticket = await this.prisma.ticket.update({
      where: {
        uuid: ticketId,
      },
      data: {
        ...updateTicketDto,
      },
    });
    return plainToInstance(RetrieveTicketDto, ticket);
  }

  async deleteTicket(ticketId: string): Promise<RetrieveTicketDto> {
    const ticket = await this.prisma.ticket.update({
      where: {
        uuid: ticketId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return plainToInstance(RetrieveTicketDto, ticket);
  }

  async buyCart(userId: string): Promise<RetrieveOrderDto> {
    const order = await this.getCart(userId);

    const orderId = order.uuid;

    await this.prisma.order.update({
      where: {
        uuid: orderId,
      },
      data: {
        tickets: {
          updateMany: {
            where: {
              status: TicketStatus.RESERVED,
              deletedAt: null,
            },
            data: {
              status: TicketStatus.PAID,
            },
          },
        },
        status: OrderStatus.CLOSED,
      },
    });

    return plainToInstance(RetrieveOrderDto, order);
  }

  async getOrders(userId: string): Promise<RetrieveOrderDto[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
    });
    return orders.map((order) => plainToInstance(RetrieveOrderDto, order));
  }

  async deleteOrder(orderId: string): Promise<RetrieveOrderDto> {
    const order = await this.prisma.order.update({
      where: {
        uuid: orderId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return plainToInstance(RetrieveOrderDto, order);
  }
  async getLikedEvents(userId: string): Promise<RetrieveEventDto[]> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        uuid: userId,
      },
      select: {
        likedEvents: true,
      },
    });

    return user.likedEvents.map((event) =>
      plainToInstance(RetrieveEventDto, event),
    );
  }

  async getEvents(userId: string): Promise<RetrieveEventDto[]> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        uuid: userId,
      },
      select: {
        orders: {
          select: {
            tickets: {
              select: {
                event: true,
              },
            },
          },
        },
      },
    });

    const events: RetrieveEventDto[] = [];
    user.orders.map((order) =>
      order.tickets.map((ticket) =>
        events.push(plainToInstance(RetrieveEventDto, ticket.event)),
      ),
    );

    return events;
  }
}
