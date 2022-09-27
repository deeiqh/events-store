import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Token } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaErrors, TokenActivity } from 'src/utils/enums';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async generateTokenDto(
    userId: string,
    activity = TokenActivity.AUTHENTICATE,
    expirationMinutes = process.env.JWT_EXPIRATION_TIME_MINUTES as string,
    secret = process.env.JWT_SECRET as string, //
  ): Promise<TokenDto> {
    const iat = new Date().getTime();
    const exp = iat + parseInt(expirationMinutes) * 60 * 1000;

    const sub = (await this.createTokenRecord(userId, activity)).sub;

    const token = this.jwtService.sign({ sub, iat, exp }); //
    return { token, expiration: new Date(exp).toUTCString() };
  }

  async createTokenRecord(
    userId: string,
    activity: TokenActivity,
  ): Promise<Token> {
    try {
      const tokenRecord = await this.prisma.token.create({
        data: {
          user_id: userId,
          activity,
        },
      });
      return tokenRecord;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrors.FOREIGN_KEY_CONSTRAINT:
            throw new NotFoundException('User not found');
          case PrismaErrors.DUPLICATED: {
            if (activity === TokenActivity.AUTHENTICATE) {
              await this.prisma.token.delete({
                where: {
                  user_id_activity: {
                    user_id: userId,
                    activity,
                  },
                },
              });
              throw new ForbiddenException('Forbidden. Signed out');
            }
            throw new ForbiddenException(
              'Frobidden. Has previous token to confirm the email',
            );
          }
          default:
            throw error;
        }
      }
      throw error;
    }
  }
}
