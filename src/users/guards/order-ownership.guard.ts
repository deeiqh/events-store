import {
  CanActivate,
  ExecutionContext,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class OrderOwnerShip implements CanActivate {
  @Inject(PrismaService)
  private prisma: PrismaService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user;
    const orderId = req.params.orderId;

    const order = await this.prisma.order.findUnique({
      where: {
        uuid: orderId,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId === userId) {
      return true;
    }

    return false;
  }
}
