import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@snipstash/api/prisma';
import { HashingService } from '@snipstash/api/security';
import { UsersService } from '@snipstash/api/users';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import {
  InvalidRefreshTokenError,
  RefreshTokenService,
} from './refresh-token.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidPassword = await this.hashingService.compare(
      user.passwordHash,
      signInDto.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id);
  }

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersService.findByEmail(signUpDto.email);
    if (existingUser) {
      throw new ConflictException();
    }

    const user = await this.usersService.create(signUpDto);
    return this.generateTokens(user.id);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const { user } = await this.refreshTokenService.validateAndGetUser(
        refreshToken
      );

      return this.generateTokens(user.id);
    } catch (error) {
      if (error instanceof InvalidRefreshTokenError) {
        throw new UnauthorizedException(error.message);
      }

      throw new UnauthorizedException();
    }
  }

  private async generateTokens(userId: string) {
    const accessToken = await this.jwtService.signAsync({ sub: userId });
    const newRefreshToken = await this.refreshTokenService.create(userId);
    return { accessToken, refreshToken: newRefreshToken };
  }
}
