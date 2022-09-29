import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterEventDto } from './dto/request/filter.dto';
import { EvenStatus, OrderStatus } from '@prisma/client';
import { EventCategory } from '@prisma/client';
import { RetrieveEventDto } from './dto/response/retrieve.dto';
import { plainToInstance } from 'class-transformer';
import { CreateEventDto } from './dto/request/create.dto';
import { UpdateEventDto } from './dto/request/update.dto';
import { CreateTicketDto } from './dto/request/create-ticket.dto';
import { RetrieveOrderDto } from './dto/response/retrieve-order.dtos';
import { RetrieveTicketsDetailDto } from './dto/response/retrieve-tickets-detail.dto';
import { CreateTicketsDetailDto } from './dto/request/create-tickets-detail.dto';
import { updateTicketsDetailDto } from './dto/request/update-tickets-detail.dto';
import { RetrieveTicketDto } from './dto/response/retrieve-ticket.dto';
import { RetrieveUserDto } from 'src/users/dto/response/retrieve.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getEvents(filterEventDto: FilterEventDto): Promise<RetrieveEventDto[]> {
    const { category } = filterEventDto;

    let where: { deleted_at: null; OR: object[]; category?: EventCategory };
    if (
      category &&
      Object.values(EventCategory).includes(category as EventCategory)
    ) {
      where = {
        deleted_at: null,
        OR: [{ status: EvenStatus.SCHEDULED }, { status: EvenStatus.LIVE }],
        category: category as EventCategory,
      };
    } else {
      where = {
        deleted_at: null,
        OR: [{ status: EvenStatus.SCHEDULED }, { status: EvenStatus.LIVE }],
      };
    }

    const events = await this.prisma.event.findMany({
      where,
      include: {
        user: true,
        tickets_details: true,
      },
    });

    return events.map((event) => plainToInstance(RetrieveEventDto, event));
  }

  async createEvent(
    createEventDto: CreateEventDto,
    userId: string,
  ): Promise<RetrieveEventDto> {
    const event = await this.prisma.event.create({
      data: {
        ...createEventDto,
        user_id: userId,
      },
    });

    return plainToInstance(RetrieveEventDto, event);
  }

  async getEvent(eventId: string): Promise<RetrieveEventDto> {
    const event = await this.prisma.event.findUnique({
      where: {
        uuid: eventId,
      },
      include: {
        user: true,
        tickets_details: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return plainToInstance(RetrieveEventDto, event);
  }

  async updateEvent(
    eventId: string,
    updateEventDto: UpdateEventDto,
  ): Promise<RetrieveEventDto> {
    const event = await this.prisma.event.update({
      where: {
        uuid: eventId,
      },
      data: {
        ...updateEventDto,
      },
    });

    return plainToInstance(RetrieveEventDto, event);
  }

  async deleteEvent(eventId: string): Promise<RetrieveEventDto> {
    const event = await this.prisma.event.update({
      where: {
        uuid: eventId,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return plainToInstance(RetrieveEventDto, event);
  }

  async addToCart(
    eventId: string,
    userId: string,
    createTicketDto: CreateTicketDto,
  ): Promise<{ orderDto: RetrieveOrderDto; orderId: string }> {
    const order = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.CART,
      },
    });

    if (order.length > 1) {
      throw new PreconditionFailedException('More than one cart found');
    }

    let orderId;

    if (order.length) {
      orderId = order[0].uuid;
    } else {
      const newOrder = await this.prisma.order.create({
        data: {
          user_id: userId,
        },
      });

      orderId = newOrder.uuid;
    }

    await this.prisma.ticket.create({
      data: {
        ...createTicketDto,
        event_id: eventId,
        user_id: userId,
        order_id: orderId,
      },
    });

    const ticketPrice = createTicketDto.final_price;
    const updatedOrder = await this.prisma.order.update({
      where: { uuid: orderId },
      data: {
        final_price: {
          increment: ticketPrice,
        },
      },
    });

    return {
      orderDto: plainToInstance(RetrieveOrderDto, updatedOrder),
      orderId,
    };
  }

  async buyCart(orderId: string): Promise<RetrieveOrderDto> {
    const order = await this.prisma.order.update({
      where: {
        uuid: orderId,
      },
      data: {
        status: OrderStatus.CLOSED,
      },
    });

    return plainToInstance(RetrieveOrderDto, order);
  }

  async getTicketsDetails(
    eventId: string,
  ): Promise<RetrieveTicketsDetailDto[]> {
    const ticketsDetails = await this.prisma.tickets_detail.findMany({
      where: {
        event_id: eventId,
        deleted_at: null,
      },
    });

    return ticketsDetails.map((ticketsDetail) =>
      plainToInstance(RetrieveTicketsDetailDto, ticketsDetail),
    );
  }

  async createTicketsDetail(
    eventId: string,
    createTicketsDetailDto: CreateTicketsDetailDto,
  ): Promise<RetrieveTicketsDetailDto> {
    const ticketsDetail = await this.prisma.tickets_detail.create({
      data: {
        ...createTicketsDetailDto,
      },
    });
    return plainToInstance(RetrieveTicketsDetailDto, ticketsDetail);
  }

  async getTicketsDetail(
    ticketsDetailId: string,
  ): Promise<RetrieveTicketsDetailDto> {
    const ticketsDetail = await this.prisma.tickets_detail.findUnique({
      where: { uuid: ticketsDetailId },
    });
    if (!ticketsDetail) {
      throw new NotFoundException('Tickets detail not found');
    }
    return plainToInstance(RetrieveTicketsDetailDto, ticketsDetail);
  }

  async updateTicketsDetail(
    ticketsDetailId: string,
    updateTicketsDetail: updateTicketsDetailDto,
  ): Promise<RetrieveTicketsDetailDto> {
    const ticketsDetail = await this.prisma.tickets_detail.update({
      where: { uuid: ticketsDetailId },
      data: {
        ...updateTicketsDetail,
      },
    });
    return plainToInstance(RetrieveTicketsDetailDto, ticketsDetail);
  }

  async deleteTicketsDetail(
    ticketsDetailId: string,
  ): Promise<RetrieveTicketsDetailDto> {
    const ticketsDetail = await this.prisma.tickets_detail.update({
      where: { uuid: ticketsDetailId },
      data: {
        deleted_at: new Date(),
      },
    });
    return plainToInstance(RetrieveTicketsDetailDto, ticketsDetail);
  }

  async getTickets(eventId: string): Promise<RetrieveTicketDto[]> {
    const tickets = await this.prisma.ticket.findMany({
      where: {
        event_id: eventId,
        deleted_at: null,
      },
    });
    return tickets.map((ticket) => plainToInstance(RetrieveTicketDto, ticket));
  }

  async getTicket(ticketId: string): Promise<RetrieveTicketDto> {
    const ticket = await this.prisma.ticket.findUnique({
      where: {
        uuid: ticketId,
      },
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return plainToInstance(RetrieveTicketDto, ticket);
  }

  async likeOrDislikeEvent(
    userId: string,
    eventId: string,
  ): Promise<RetrieveEventDto> {
    const user = await this.prisma.event.findUnique({
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

    if (!user) {
      throw new NotFoundException('Not found');
    }

    let event;
    if (!user.likes.length) {
      event = await this.prisma.event.update({
        where: {
          uuid: eventId,
        },
        data: {
          likes: {
            connect: {
              uuid: userId,
            },
          },
          likes_number: {
            increment: 1,
          },
        },
      });
    } else {
      event = await this.prisma.event.update({
        where: {
          uuid: eventId,
        },
        data: {
          likes: {
            disconnect: {
              uuid: userId,
            },
          },
          likes_number: {
            decrement: 1,
          },
        },
      });
    }

    return plainToInstance(RetrieveEventDto, event);
  }

  async getLikes(eventId: string): Promise<RetrieveUserDto[]> {
    const event = await this.prisma.event.findUnique({
      where: {
        uuid: eventId,
      },
      select: {
        likes: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event.likes.map((user) => plainToInstance(RetrieveUserDto, user));
  }
}
