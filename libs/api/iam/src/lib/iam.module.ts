import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from '@snipstash/api/security';
import { UsersModule } from '@snipstash/api/users';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RefreshTokenService } from './authentication/refresh-token.service';
import { jwtConfig } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES },
      }),
    }),
    SecurityModule,
    UsersModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    AccessTokenGuard,
    AuthenticationService,
    RefreshTokenService,
  ],
  exports: [],
})
export class IamModule {}
