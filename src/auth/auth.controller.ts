import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signIn.dto';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<TokenDto> {
    return await this.authService.register(registerDto);
  }

  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<TokenDto> {
    return await this.authService.signIn(signInDto);
  }

  @Post('/sign-out')
  async signOut(@Body() tokenString: string): Promise<void> {
    return await this.authService.signOut(tokenString);
  }
}
