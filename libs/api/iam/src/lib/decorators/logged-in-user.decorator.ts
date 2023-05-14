import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentActiveUser } from '@snipstash/types';
import { REQUEST_USER_KEY } from '../iam.constants';

export const LoggedInUser = createParamDecorator(
  (field: keyof CurrentActiveUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: CurrentActiveUser = request[REQUEST_USER_KEY];
    return field ? user[field] : user;
  }
);
