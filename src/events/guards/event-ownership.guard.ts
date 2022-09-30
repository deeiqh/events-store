import {
  CanActivate,
  ExecutionContext,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class EventOwnershipGuard implements CanActivate {
  @Inject(PrismaService)
  private prisma: PrismaService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const userId = req.user;
    const eventId = req.params.eventId;

    const event = await this.prisma.event.findUnique({
      where: {
        uuid: eventId,
      },
      select: {
        userId: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.userId === userId) {
      return true;
    }

    return false;
  }
}
