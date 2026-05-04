import { Controller, Get } from '@nestjs/common';
import { LessonsService } from './lessons.service';

/**
 * REST controller for the `/lessons` route.
 *
 * Handles HTTP requests related to `Lesson` resources and delegates
 * business logic to {@link LessonsService}.
 */
@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  /**
   * `GET /lessons`
   *
   * Returns a lesson record.
   *
   * @returns The lesson object from {@link LessonsService.getLessonById}.
   */
  @Get('')
  findLesson() {
    return this.lessonsService.getLessonById();
  }
}
