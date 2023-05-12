import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoggedInUser } from '../decorators/logged-in-user.decorator';
import { LoggedInUserType } from '../types/logged-in-user.type';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { SignInDto } from './dto/sign-in-dto';

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
  @Get('test')
  publicRoute() {
    return 'public';
  }
}
