import { Injectable } from '@nestjs/common';

/**
 * Root application service.
 * Provides the health-check response returned by the root controller.
 */
@Injectable()
export class AppService {
  /**
   * Returns a simple greeting string used by the root health-check endpoint.
   *
   * @returns A static greeting message confirming the service is reachable.
   */
  getHello(): string {
    return 'This is the return value from the app.service.ts file: HELLO THERE!!!!';
  }
}
