import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/prisma/client';
import { faker } from '@faker-js/faker';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const topics = await prisma.topic.createManyAndReturn({
    data: Array.from({ length: 5 }, () => {
      return {
        id: undefined,
        title: faker.lorem.words(3),
        description: faker.lorem.sentences(2),
        era: faker.date.past().getFullYear().toString(),
        region: faker.location.country(),
      };
    }),
    select: { id: true },
  });

  for (const topic of topics) {
    await prisma.lesson.createMany({
      data: Array.from({ length: 10 }, () => {
        return {
          topicId: faker.number.int({ min: topic.id, max: topic.id }),
          title: faker.lorem.sentence(),
          difficulty: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced']),
          orderIndex: faker.number.int({ min: 1, max: 100 }),
        };
      }),
    });
  }
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
