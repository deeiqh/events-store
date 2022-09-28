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
import { GetUser } from 'src/utils/get-user.decorator';
import { AddToCartDto } from './dto/request/add-to-cart.dto';
import { CreateEventDto } from './dto/request/create.dto';
import { FilterEventDto } from './dto/request/filter.dto';
import { UpdateEventDto } from './dto/request/update.dto';
import { RetrieveEventDto } from './dto/response/retrieve.dto';
import { EventsService } from './events.service';

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
    @GetUser() user_id: string,
  ): Promise<RetrieveEventDto> {
    return await this.eventsService.createEvent(createEventDto, user_id);
  }

  @Get('/:eventId')
  async getEvent(@Param('eventId') eventId: string): Promise<RetrieveEventDto> {
    return await this.eventsService.getEvent(eventId);
  }

  @Patch('/:eventId')
  @UseGuards(AuthGuard())
  //own guard
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
    //@GetUser() user_id: string,
  ): Promise<RetrieveEventDto> {
    return await this.eventsService.updateEvent(eventId, updateEventDto);
  }

  @Delete('/:eventId')
  @UseGuards(AuthGuard())
  //own guard
  async deleteEvent(
    @Param('eventId') eventId: string,
  ): Promise<RetrieveEventDto> {
    return await this.eventsService.deleteEvent(eventId);
  }

  @Post('/:eventId/add-to-cart')
  @UseGuards(AuthGuard())
  //own guard
  async addToCart(
    @Param('eventId') eventId: string,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<RetrieveOrderDto> {}
}
