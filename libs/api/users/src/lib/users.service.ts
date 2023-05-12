import { Injectable } from '@nestjs/common';
import { PrismaService } from '@snipstash/api/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
