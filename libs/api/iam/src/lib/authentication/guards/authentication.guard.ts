import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY, AuthTypes } from '../decorators/auth.decorator';
import { AccessTokenGuard } from './access-token.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType: AuthTypes = 'Bearer';
  private readonly authTypeGuardMap: Record<AuthTypes, CanActivate> = {
    Bearer: this.accessTokenGuard,
    None: { canActivate: () => true },
  };
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthTypes[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()]
    ) || [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]);
    let error = new UnauthorizedException();
    for (const guard of guards) {
      const canActivate = await Promise.resolve(
        guard.canActivate(context)
      ).catch((err) => {
        error = err;
      });

      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
