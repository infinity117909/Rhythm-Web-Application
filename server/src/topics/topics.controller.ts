import { Controller } from '@nestjs/common';

/**
 * REST controller for the `/topics` route.
 *
 * Handles HTTP requests related to `Topic` resources.
 *
 * @todo Add route handlers:
 *   - `GET /topics` — list all topics
 *   - `GET /topics/:id` — get topic by ID
 *   - `GET /topics/slug/:slug` — get topic by URL slug
 */
@Controller('topics')
export class TopicsController {}
