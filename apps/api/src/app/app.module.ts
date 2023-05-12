import { Module } from '@nestjs/common';

import { IamModule } from '@snipstash/api/iam';
import { PrismaModule } from '@snipstash/api/prisma';
import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule, IamModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
