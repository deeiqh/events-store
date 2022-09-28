import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashSync, compareSync } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/request/register.dto';
import { SignInDto } from './dto/request/signIn.dto';
import { TokenDto } from './dto/response/token.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async register({ password, ...input }: RegisterDto): Promise<TokenDto> {
    const userFound = await this.prisma.user.findUnique({
      select: { uuid: true },
      where: { email: input.email },
    });

    if (userFound) {
      throw new BadRequestException('Email already registered');
    }

    const user = await this.prisma.user.create({
      data: {
        password: hashSync(password),
        ...input,
      },
    });

    const tokenDto = await this.tokenService.generateTokenDto(user.uuid);

    return tokenDto;
  }

  async signIn({ email, password }: SignInDto): Promise<TokenDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordOk = compareSync(password, user.password);

    if (!passwordOk) {
      throw new BadRequestException('Invalid password');
    }

    const tokenDto = await this.tokenService.generateTokenDto(user.uuid);
    return tokenDto;
  }

  async signOut(tokenString: undefined | string): Promise<void> {
    if (!tokenString) {
      throw new PreconditionFailedException('No token received');
    }

    try {
      const { sub } = this.jwtService.verify(tokenString, {
        secret: process.env.JWT_SECRET as string,
      });
      await this.prisma.token.delete({
        where: {
          sub: sub as string,
        },
      });
    } catch (error) {
      throw new PreconditionFailedException('Signed out');
    }
  }
}
