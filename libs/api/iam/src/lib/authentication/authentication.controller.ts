import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in-dto';
import { AuthenticationGuard } from './guards/authentication.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(AuthenticationGuard)
  @Get('me')
  currentUser(@Request() request: Request) {
    return request['user'];
  }
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authenticationService.signIn(signInDto);
  }

  @Get('test')
  publicRoute() {
    return 'public';
  }
}
