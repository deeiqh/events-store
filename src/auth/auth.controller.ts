import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/request/register.dto';
import { SignInDto } from './dtos/request/signIn.dto';
import { SignOutDto } from './dtos/request/sign-out.dto';
import { RetrieveTokenDto } from './dtos/response/retrieve-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<RetrieveTokenDto> {
    return await this.authService.register(registerDto);
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<RetrieveTokenDto> {
    return await this.authService.signIn(signInDto);
  }

  @Post('sign-out')
  async signOut(@Body() signOutDto: SignOutDto): Promise<void> {
    return await this.authService.signOut(signOutDto);
  }
}
