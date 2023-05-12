import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../iam.constants';
import { LoggedInUserType } from '../types/logged-in-user.type';

export const LoggedInUser = createParamDecorator(
  (field: keyof LoggedInUserType, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: LoggedInUserType = request[REQUEST_USER_KEY];
    return field ? user[field] : user;
  }
);
