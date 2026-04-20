import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaService } from '../prisma.service.js';

@Module({
  providers: [LessonsService, PrismaService],
  controllers: [LessonsController],
})
export class LessonsModule {}
