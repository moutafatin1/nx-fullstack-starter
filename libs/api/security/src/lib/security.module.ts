import { Module } from '@nestjs/common';
import { Argon2Service } from './hashing/argon2.service';
import { HashingService } from './hashing/hashing.service';

@Module({
  controllers: [],
  providers: [{ provide: HashingService, useClass: Argon2Service }],
  exports: [HashingService],
})
export class SecurityModule {}
