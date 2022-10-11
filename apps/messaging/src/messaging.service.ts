import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagingService {
  getHello(): string {
    return 'Hello World!';
  }
}
