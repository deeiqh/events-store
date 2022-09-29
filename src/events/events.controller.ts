import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RetrieveOrderDto } from './dto/response/retrieve-order.dtos';
import { CreateTicketDto } from './dto/request/create-ticket.dto';
import { GetUser } from 'src/utils/get-user.decorator';
import { CreateEventDto } from './dto/request/create.dto';
import { FilterEventDto } from './dto/request/filter.dto';
import { UpdateEventDto } from './dto/request/update.dto';
import { RetrieveTicketsDetailDto } from './dto/response/retrieve-tickets-detail.dto';
import { RetrieveEventDto } from './dto/response/retrieve.dto';
import { EventsService } from './events.service';
import { CreateTicketsDetailDto } from './dto/request/create-tickets-detail.dto';
import { updateTicketsDetailDto } from './dto/request/update-tickets-detail.dto';
import { RetrieveTicketDto } from './dto/response/retrieve-ticket.dto';
import { RetrieveUserDto } from 'src/users/dto/response/retrieve.dto';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  async getEvents(
    @Query() filterEventDto: FilterEventDto,
  ): Promise<RetrieveEventDto[]> {
    return await this.eventsService.getEvents(filterEventDto);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @GetUser() userId: string,
  ): Promise<RetrieveEventDto> {
    return await this.eventsService.createEvent(createEventDto, userId);
  }

  @Get(':eventId')
  async getEvent(@Param('eventId') eventId: string): Promise<RetrieveEventDto> {
    return await this.eventsService.getEvent(eventId);
  }

  @Patch(':eventId')
  @UseGuards(AuthGuard())
  //own guard
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
    //@GetUser() user_id: string,
  ): Promise<RetrieveEventDto> {
    return await this.eventsService.updateEvent(eventId, updateEventDto);
  }

  @Delete(':eventId')
  @UseGuards(AuthGuard())
  //own guard
  async deleteEvent(
    @Param('eventId') eventId: string,
  ): Promise<RetrieveEventDto> {
    return await this.eventsService.deleteEvent(eventId);
  }

  @Post(':eventId/add-to-cart')
  @UseGuards(AuthGuard())
  async addToCart(
    @Param('eventId') eventId: string,
    @GetUser() userId: string,
    @Body() createTicketDto: CreateTicketDto,
  ): Promise<RetrieveOrderDto> {
    const { orderDto } = await this.eventsService.addToCart(
      eventId,
      userId,
      createTicketDto,
    );
    return orderDto;
  }

  @Post(':eventId/buy')
  @UseGuards(AuthGuard())
  async buyEvent(
    @Param('eventId') eventId: string,
    @GetUser() userId: string,
    @Body() createTicketDto: CreateTicketDto,
  ): Promise<RetrieveOrderDto> {
    const { orderId } = await this.eventsService.addToCart(
      eventId,
      userId,
      createTicketDto,
    );
    return await this.eventsService.buyCart(orderId);
  }

  @Get(':eventId/tickets-details')
  async getTicketsDetails(
    @Param('eventId') eventId: string,
  ): Promise<RetrieveTicketsDetailDto[]> {
    return await this.eventsService.getTicketsDetails(eventId);
  }

  @Post(':eventId/tickets-details')
  @UseGuards(AuthGuard())
  //event pwner
  async createTicketsDetail(
    @Param('eventId') eventId: string,
    @Body() createTicketsDetailDto: CreateTicketsDetailDto,
  ): Promise<RetrieveTicketsDetailDto> {
    return await this.eventsService.createTicketsDetail(
      eventId,
      createTicketsDetailDto,
    );
  }

  @Get('tickets-details/:ticketsDetailId')
  async getTicketsDetail(@Param('ticketsDetailId') ticketsDetailId: string) {
    return await this.eventsService.getTicketsDetail(ticketsDetailId);
  }

  @Patch('tickets-details/:ticketsDetailId')
  @UseGuards(AuthGuard())
  //event owner
  async updateTicketsDetail(
    @Param('ticketsDetailId') ticketsDetailId: string,
    @Body() updateTicketsDetail: updateTicketsDetailDto,
  ) {
    return await this.eventsService.updateTicketsDetail(
      ticketsDetailId,
      updateTicketsDetail,
    );
  }

  @Delete('tickets-details/:ticketsDetailId')
  @UseGuards(AuthGuard())
  //event owner
  async deleteTicketsDetail(@Param('ticketsDetailId') ticketsDetailId: string) {
    return await this.eventsService.deleteTicketsDetail(ticketsDetailId);
  }

  @Get(':eventId/tickets')
  @UseGuards(AuthGuard())
  //eventt owner
  async getTickets(
    @Param('eventId') eventId: string,
  ): Promise<RetrieveTicketDto[]> {
    return await this.eventsService.getTickets(eventId);
  }

  @Post(':eventId/like')
  @UseGuards(AuthGuard())
  async likeOrDislikeEvent(
    @GetUser() userId: string,
    @Param('eventId') eventId: string,
  ): Promise<RetrieveEventDto> {
    return await this.eventsService.likeOrDislikeEvent(userId, eventId);
  }

  @Post(':eventId/likes')
  async getLikes(
    @Param('eventId') eventId: string,
  ): Promise<RetrieveUserDto[]> {
    return this.eventsService.getLikes(eventId);
  }
}
