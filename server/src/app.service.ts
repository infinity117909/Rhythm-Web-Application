import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This is the return value from the app.service.ts file: HELLO THERE!!!!';
  }
}
