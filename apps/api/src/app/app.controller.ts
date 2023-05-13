import { Controller, Get } from '@nestjs/common';
import { Auth } from '@snipstash/api/iam';

@Controller()
export class AppController {
  @Auth('None')
  @Get()
  getData() {
    return { message: 'Hello API' };
  }
}
