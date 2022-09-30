import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { RetrieveOrderDto } from './dtos/response/retrieve-order.dtos';
import { CreateTicketDto } from './dtos/request/create-ticket.dto';
import { GetUser } from 'src/utils/decorators/get-user.decorator';
import { CreateEventDto } from './dtos/request/create.dto';
import { UpdateEventDto } from './dtos/request/update.dto';
import { RetrieveTicketsDetailDto } from './dtos/response/retrieve-tickets-detail.dto';
import { RetrieveEventDto } from './dtos/response/retrieve.dto';
import { EventsService } from './events.service';
import { CreateTicketsDetailDto } from './dtos/request/create-tickets-detail.dto';
import { updateTicketsDetailDto } from './dtos/request/update-tickets-detail.dto';
import { RetrieveTicketDto } from './dtos/response/retrieve-ticket.dto';
import { RetrieveUserDto } from 'src/users/dtos/response/retrieve.dto';
import { EventOwnershipGuard } from './guards/event-ownership.guard';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  async getEvents(
    @Query() query: { category: string; take: string; cursor: string },
  ): Promise<{
    events: RetrieveEventDto[];
    pagination: { take?: number; cursor?: string };
  }> {
    return await this.eventsService.getEvents(
      query.category,
      parseInt(query.take),
      query.cursor,
    );
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
  @UseGuards(AuthGuard(), EventOwnershipGuard)
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<RetrieveEventDto> {
    return await this.eventsService.updateEvent(eventId, updateEventDto);
  }

  @Delete(':eventId')
  @UseGuards(AuthGuard(), EventOwnershipGuard)
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
  @UseGuards(AuthGuard(), EventOwnershipGuard)
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
  @UseGuards(AuthGuard(), EventOwnershipGuard)
  async updateTicketsDetail(
    @Param('ticketsDetailId') ticketsDetailId: string,
    @Body() updateTicketsDetail: updateTicketsDetailDto,
  ) {
    return await this.eventsService.updateTicketsDetail(
      ticketsDetailId,
      updateTicketsDetail,
    );
  }

  @Delete(':eventId/tickets-details/:ticketsDetailId')
  @UseGuards(AuthGuard(), EventOwnershipGuard)
  async deleteTicketsDetail(@Param('ticketsDetailId') ticketsDetailId: string) {
    return await this.eventsService.deleteTicketsDetail(ticketsDetailId);
  }

  @Get(':eventId/tickets')
  @UseGuards(AuthGuard(), EventOwnershipGuard)
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

  @Post(':eventId/upload-image')
  @UseGuards(AuthGuard(), EventOwnershipGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('eventId') eventId: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<RetrieveEventDto> {
    return await this.eventsService.uploadImage(
      eventId,
      image.buffer,
      image.originalname,
    );
  }
}
