import { Body, Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request, Response } from 'express';
import { jwtConfig } from '../config/jwt.config';
import { LoggedInUser } from '../decorators/logged-in-user.decorator';
import { LoggedInUserType } from '../types/logged-in-user.type';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>
  ) {}

  @Get('me')
  currentUser(@LoggedInUser() user: LoggedInUserType) {
    return user;
  }

  @Auth('None')
  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const { refreshToken, accessToken } =
      await this.authenticationService.signIn(signInDto);

    response.cookie(this.config.REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
      domain: 'localhost',
      signed: true,
    });

    return { accessToken };
  }

  @Auth('None')
  @Post('signup')
  async signUp(@Body() SignUpDto: SignUpDto) {
    return this.authenticationService.signUp(SignUpDto);
  }

  @Auth('None')
  @Post('refresh-tokens')
  async refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const { refreshToken, accessToken } =
      await this.authenticationService.refreshTokens(
        request.signedCookies[this.config.REFRESH_TOKEN_KEY]
      );

    response.cookie(this.config.REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
      domain: 'localhost',
      signed: true,
    });

    return { accessToken };
  }
}
