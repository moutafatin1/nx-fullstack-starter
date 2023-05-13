import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from '@snipstash/api/security';
import { UsersModule } from '@snipstash/api/users';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'xxxx',
      signOptions: { expiresIn: '1h' },
    }),
    SecurityModule,
    UsersModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    AccessTokenGuard,
    AuthenticationService,
  ],
  exports: [],
})
export class IamModule {}
