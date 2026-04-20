import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service.js';
import { PrismaModule } from './prisma.module.js';
import { LessonsService } from './lessons/lessons.service.js';
import { LessonsModule } from './lessons/lessons.module';
import { TopicsModule } from './topics/topics.module';
import { TopicsService } from './topics/topics.service';

@Module({
  imports: [LessonsModule, TopicsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, LessonsService, TopicsService],
})
export class AppModule {}
