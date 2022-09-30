import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { TokenService } from './auth/token.service';
import { PrismaService } from './prisma/prisma.service';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { environmentValidationSchema } from './utils/validation-schemas/environment-variables.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: environmentValidationSchema,
    }),
    AuthModule,
    EventsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtService, PrismaService, TokenService],
})
export class AppModule {}
