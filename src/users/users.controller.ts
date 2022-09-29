import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RetrieveOrderDto } from 'src/events/dto/response/retrieve-order.dtos';
import { RetrieveTicketDto } from 'src/events/dto/response/retrieve-ticket.dto';
import { RetrieveEventDto } from 'src/events/dto/response/retrieve.dto';
import { GetUser } from 'src/utils/get-user.decorator';
import { UpdateTicketDto } from './dto/request/update-ticket.dto';
import { UpdateUserDto } from './dto/request/update.dto';
import { RetrieveUserDto } from './dto/response/retrieve.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard())
  async getUser(@GetUser() userId: string): Promise<RetrieveUserDto> {
    return await this.usersService.getUser(userId);
  }

  @Post('me')
  @UseGuards(AuthGuard())
  async updateUser(
    @GetUser() userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<RetrieveUserDto> {
    return await this.usersService.updateUser(userId, updateUserDto);
  }

  @Get('me/cart')
  @UseGuards(AuthGuard())
  async getCart(@GetUser() userId: string): Promise<RetrieveOrderDto> {
    return await this.usersService.getCart(userId);
  }

  @Post('cart/:ticketId')
  @UseGuards(AuthGuard())
  //cart owner
  async updateTicket(
    @Param('ticketId') ticketId: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<RetrieveTicketDto> {
    return await this.usersService.updateTicket(ticketId, updateTicketDto);
  }

  @Delete('cart/:ticketId')
  @UseGuards(AuthGuard())
  //cart owner
  async deleteTicket(
    @Param('ticketId') ticketId: string,
  ): Promise<RetrieveTicketDto> {
    return await this.usersService.deleteTicket(ticketId);
  }

  @Post('me/cart/buy')
  @UseGuards(AuthGuard())
  //cart owner
  async buyCart(@GetUser() userId: string): Promise<RetrieveOrderDto> {
    return await this.usersService.buyCart(userId);
  }

  @Get('me/orders')
  @UseGuards(AuthGuard())
  async getOrders(@GetUser() userId: string): Promise<RetrieveOrderDto[]> {
    return await this.usersService.getOrders(userId);
  }

  @Delete('orders/:orderId')
  @UseGuards(AuthGuard())
  //order owner
  async deleteOrder(
    @Param('orderId') orderId: string,
  ): Promise<RetrieveOrderDto> {
    return await this.usersService.deleteOrder(orderId);
  }

  @Get('me/likes')
  @UseGuards(AuthGuard())
  async getLikedEvents(@GetUser() userId: string): Promise<RetrieveEventDto[]> {
    return this.usersService.getLikedEvents(userId);
  }

  @Get('me/events')
  @UseGuards(AuthGuard())
  async getEvents(@GetUser() userId: string): Promise<RetrieveEventDto[]> {
    return this.usersService.getEvents(userId);
  }

  @Get(':userId/orders')
  @UseGuards(AuthGuard())
  //manager role
  async getUserOrders(
    @Param('userId') userId: string,
  ): Promise<RetrieveOrderDto[]> {
    return await this.usersService.getOrders(userId);
  }

  @Delete('orders/:orderId')
  @UseGuards(AuthGuard())
  //manager role
  async deleteUserOrder(
    @Param('orderId') orderId: string,
  ): Promise<RetrieveOrderDto> {
    return await this.usersService.deleteOrder(orderId);
  }
}
