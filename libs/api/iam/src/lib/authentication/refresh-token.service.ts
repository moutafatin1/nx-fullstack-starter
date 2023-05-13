import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from '@snipstash/api/prisma';
import { UsersService } from '@snipstash/api/users';
import * as crypto from 'crypto';
import { jwtConfig } from '../config/jwt.config';

export class InvalidRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>
  ) {}

  async create(userId: string) {
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = this.config.REFRESH_TOKEN_EXPIRES;
    const refreshToken = await this.prisma.refreshToken.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        token,
        expiresAt,
      },
      update: {
        token,
        expiresAt,
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
