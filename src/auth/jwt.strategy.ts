import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      secretOrKey: `configService.get('process.env.JWT_SECRET' as string)`,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(sub: string): Promise<string> {
    const tokenRecord = await this.prisma.token.findUnique({
      where: {
        sub,
      },
      select: {
        user_id: true,
        activity: true,
      },
    });

    if (!tokenRecord?.user_id) {
      throw new UnauthorizedException();
    }

    return tokenRecord.user_id;
  }
}
