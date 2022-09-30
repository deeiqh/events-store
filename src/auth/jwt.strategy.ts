import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenActivity } from 'src/utils/enums/prisma-enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      secretOrKey: process.env.JWT_SECRET as string,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any): Promise<string> {
    const tokenRecord = await this.prisma.token.findUnique({
      where: {
        sub: payload.sub,
      },
      select: {
        userId: true,
        activity: true,
      },
    });

    if (!tokenRecord || tokenRecord.activity !== TokenActivity.AUTHENTICATE) {
      throw new UnauthorizedException('Invalid token');
    }

    if (payload.exp < new Date().getTime()) {
      await this.prisma.token.delete({
        where: {
          sub: payload.sub as string,
        },
      });
      throw new UnauthorizedException('Expired token. Now you are signed out');
    }

    return tokenRecord.userId;
  }
}
