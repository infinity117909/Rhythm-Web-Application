import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../prisma/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * NestJS injectable wrapper around `PrismaClient`.
 *
 * Extends `PrismaClient` directly so that all Prisma model accessors
 * (`this.prisma.lesson`, `this.prisma.topic`, etc.) are available on the
 * injected service instance without any additional delegation.
 *
 * Connects to the PostgreSQL database using the `@prisma/adapter-pg` driver
 * and the `DATABASE_URL` environment variable.
 *
 * @example
 * // Inject into any NestJS service:
 * constructor(private prisma: PrismaService) {}
 * const lessons = await this.prisma.lesson.findMany();
 */
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({ adapter });
  }
}
