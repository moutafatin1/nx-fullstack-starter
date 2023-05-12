import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@snipstash/api/prisma';
import { UsersService } from '@snipstash/api/users';
import { SignInDto } from './dto/sign-in-dto';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService
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

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: 'secret',
        expiresIn: '1h',
      }
    );

    return { accessToken };
  }
}
