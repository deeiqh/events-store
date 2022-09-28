import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterEventDto } from './dto/request/filter.dto';
import { EvenStatus } from '@prisma/client';
import { EventCategory } from '@prisma/client';
import { RetrieveEventDto } from './dto/response/retrieve.dto';
import { plainToInstance } from 'class-transformer';
import { CreateEventDto } from './dto/request/create.dto';
import { UpdateEventDto } from './dto/request/update.dto';

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
        tickets_detail: true,
      },
    });

    return events.map((event) => plainToInstance(RetrieveEventDto, event));
  }

  async createEvent(
    createEventDto: CreateEventDto,
    user_id: string,
  ): Promise<RetrieveEventDto> {
    const event = await this.prisma.event.create({
      data: {
        ...createEventDto,
        user_id,
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
        tickets_detail: true,
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
}
