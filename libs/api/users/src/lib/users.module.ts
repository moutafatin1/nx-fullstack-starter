import { Module } from '@nestjs/common';
import { SecurityModule } from '@snipstash/api/security';
import { UsersService } from './users.service';

@Module({
  imports: [SecurityModule],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
