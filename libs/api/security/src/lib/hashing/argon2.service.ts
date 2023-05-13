import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { HashingService } from './hashing.service';

@Injectable()
export class Argon2Service implements HashingService {
  hash(value: string | Buffer): Promise<string> {
    return argon2.hash(value);
  }
  compare(hash: string, value: string | Buffer): Promise<boolean> {
    return argon2.verify(hash, value);
  }
}
