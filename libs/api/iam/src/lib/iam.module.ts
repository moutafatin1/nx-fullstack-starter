import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@snipstash/api/users';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { Argon2Service } from './authentication/hashing/argon2.service';
import { HashingService } from './authentication/hashing/hashing.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'xxxx',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: HashingService, useClass: Argon2Service },
    AccessTokenGuard,
    AuthenticationService,
  ],
  exports: [],
})
export class IamModule {}
