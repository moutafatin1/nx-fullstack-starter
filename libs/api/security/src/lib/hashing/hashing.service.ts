import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract hash(value: string | Buffer): Promise<string>;
  abstract compare(hash: string, value: string | Buffer): Promise<boolean>;
}
