import { SetMetadata } from '@nestjs/common';

export type AuthTypes = 'Bearer' | 'None';
export const AUTH_TYPE_KEY = 'authType';

export const Auth = (...authType: AuthTypes[]) =>
  SetMetadata(AUTH_TYPE_KEY, authType);
