import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CurrentActiveUser } from '@snipstash/types';
import { Request } from 'express';
import { jwtConfig } from '../../config/jwt.config';
@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { sub, iat, exp, ...payload } = await this.jwtService.verifyAsync<
        Omit<CurrentActiveUser, 'id'> & {
          sub: string;
          iat: number;
          exp: number;
        }
      >(token, {
        secret: this.config.JWT_SECRET,
      });
      request['user'] = {
        id: sub,
        ...payload,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
