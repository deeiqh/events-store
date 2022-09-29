import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/utils/get-user.decorator';
import { UpdateUserDto } from './dto/request/update.dto';
import { RetrieveUserDto } from './dto/response/retrieve.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard())
  async getUser(@GetUser() userId: string): Promise<RetrieveUserDto> {
    return this.usersService.getUser(userId);
  }

  @Post('me')
  @UseGuards(AuthGuard())
  async updateUser(
    @GetUser() userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<RetrieveUserDto> {
    return this.usersService.updateUser(userId, updateUserDto);
  }
}
