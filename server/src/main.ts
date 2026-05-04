import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Application bootstrap function.
 *
 * Creates the NestJS application, enables CORS for all origins (allowing the
 * frontend dev server on port 3000 to call the API), and starts the HTTP
 * listener on the port defined by the `PORT` environment variable (default 3000).
 *
 * To start the server:
 * ```bash
 * npm run start:dev   # development mode with file watching
 * npm run start:prod  # production build
 * ```
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
