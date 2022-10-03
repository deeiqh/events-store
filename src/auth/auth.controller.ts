import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/request/register.dto';
import { SignInDto } from './dtos/request/signIn.dto';
import { SignOutDto } from './dtos/request/sign-out.dto';
import { RetrieveTokenDto } from './dtos/response/retrieve-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 201, type: RetrieveTokenDto })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<RetrieveTokenDto> {
    return await this.authService.register(registerDto);
  }

  @ApiResponse({ status: 201, type: RetrieveTokenDto })
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<RetrieveTokenDto> {
    return await this.authService.signIn(signInDto);
  }

  @ApiResponse({ status: 201 })
  @Post('sign-out')
  async signOut(@Body() signOutDto: SignOutDto): Promise<void> {
    return await this.authService.signOut(signOutDto);
  }
}
