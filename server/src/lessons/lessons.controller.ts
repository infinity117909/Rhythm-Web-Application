import { Controller, Get } from '@nestjs/common';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get('')
  findLesson() {
    return this.lessonsService.getLessonById();
  }
}
