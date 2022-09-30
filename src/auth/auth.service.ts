import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashSync, compareSync } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dtos/request/register.dto';
import { SignInDto } from './dtos/request/signIn.dto';
import { SignOutDto } from './dtos/request/sign-out.dto';
import { RetrieveTokenDto } from './dtos/response/retrieve-token.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async register({
    password,
    ...input
  }: RegisterDto): Promise<RetrieveTokenDto> {
    const userFound = await this.prisma.user.findUnique({
      where: { email: input.email },
      select: { uuid: true },
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

  async signIn({ email, password }: SignInDto): Promise<RetrieveTokenDto> {
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

  async signOut(signOutDto: SignOutDto): Promise<void> {
    try {
      const { sub } = this.jwtService.verify(signOutDto.token, {
        secret: process.env.JWT_SECRET as string,
      });

      await this.prisma.token.delete({
        where: {
          sub: sub as string,
        },
      });
    } catch (error) {
      throw new PreconditionFailedException('Wrong token');
    }
  }
}
