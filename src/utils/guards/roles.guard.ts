import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  @Inject(PrismaService)
  private prisma: PrismaService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<string>('role', context.getHandler());
    if (!role) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const userId = req.user;

    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        uuid: userId,
      },
      select: {
        role: true,
      },
    });

    return role === user.role;
  }
}
