import { Injectable } from '@nestjs/common';
import { PrismaService } from '@snipstash/api/prisma';
import { UsersService } from '@snipstash/api/users';
import * as crypto from 'crypto';

export class InvalidRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService
  ) {}

  async create(userId: string) {
    const token = crypto.randomBytes(64).toString('hex');
    const refreshToken = await this.prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });
    return refreshToken.token;
  }

  async validateAndGetUser(token: string) {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken) {
      throw new InvalidRefreshTokenError('Invalid refresh token');
    }

    const user = await this.usersService.findById(refreshToken.userId);

    if (!user) {
      await this.invalidate({ token });

      throw new InvalidRefreshTokenError('Invalid refresh token');
    }
    if (refreshToken.expiresAt < new Date()) {
      await this.invalidate({ token });

      throw new InvalidRefreshTokenError('Refresh token expired');
    }

    return { user };
  }

  async invalidate({ token, userId }: { token?: string; userId?: string }) {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token, userId },
    });
    if (refreshToken) {
      await this.prisma.refreshToken.delete({ where: { token, userId } });
    }
  }
}
