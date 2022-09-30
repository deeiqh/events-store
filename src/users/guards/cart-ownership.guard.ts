import {
  CanActivate,
  ExecutionContext,
  Inject,
  PreconditionFailedException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export class CartOwnerShip implements CanActivate {
  @Inject(PrismaService)
  private prisma: PrismaService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user;

    const order = await this.prisma.order.findMany({
      where: {
        userId,
        status: OrderStatus.CART,
        deletedAt: null,
      },
    });

    if (order.length > 1) {
      throw new PreconditionFailedException('More than one cart found');
    }

    if (order.length === 1) {
      return true;
    }

    return false;
  }
}
