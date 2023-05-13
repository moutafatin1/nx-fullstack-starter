import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CookieOptions, Request, Response } from 'express';
import { jwtConfig } from '../config/jwt.config';
import { LoggedInUser } from '../decorators/logged-in-user.decorator';
import { LoggedInUserType } from '../types/logged-in-user.type';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthenticationController {
  private readonly refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(
      Date.now() + parseInt(this.config.REFRESH_TOKEN_EXPIRES) * 7
    ),
    path: '/',
    domain: 'localhost',
    signed: true,
  };
  constructor(
    private readonly authenticationService: AuthenticationService,
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>
  ) {}

  @Get('me')
  currentUser(@LoggedInUser() user: LoggedInUserType) {
    return user;
  }

  @Auth('None')
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const { refreshToken, accessToken } =
      await this.authenticationService.signIn(signInDto);

    response.cookie(
      this.config.REFRESH_TOKEN_KEY,
      refreshToken,
      this.refreshTokenCookieOptions
    );

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

    response.cookie(
      this.config.REFRESH_TOKEN_KEY,
      refreshToken,
      this.refreshTokenCookieOptions
    );

    return { accessToken };
  }

  @Delete('signout')
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    await this.authenticationService.signOut(
      request.signedCookies[this.config.REFRESH_TOKEN_KEY]
    );
    response.clearCookie(this.config.REFRESH_TOKEN_KEY, {
      expires: new Date(0),
    });
  }
}
