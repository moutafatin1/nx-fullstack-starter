import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoggedInUser } from '../decorators/logged-in-user.decorator';
import { LoggedInUserType } from '../types/logged-in-user.type';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get('me')
  currentUser(@LoggedInUser() user: LoggedInUserType) {
    return user;
  }

  @Auth('None')
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authenticationService.signIn(signInDto);
  }

  @Auth('None')
  @Post('signup')
  async signUp(@Body() SignUpDto: SignUpDto) {
    return this.authenticationService.signUp(SignUpDto);
  }

  @Auth('None')
  @Post('refresh-tokens')
  async refreshTokens(@Body() { refreshToken }: { refreshToken: string }) {
    console.log(
      '🚀 ~ file: authentication.controller.ts:33 ~ AuthenticationController ~ refreshTokens ~ refreshToken:',
      refreshToken
    );
    return this.authenticationService.refreshTokens(refreshToken);
  }
}
