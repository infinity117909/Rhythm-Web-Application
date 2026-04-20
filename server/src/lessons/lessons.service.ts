import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
//import { Lesson, Prisma } from '../../prisma/generated/prisma/client.js';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  getLessonById() {
    return {
      id: 1,
      title: 'Sample Title',
      createdAt: new Date(),
    };
  }
}



  //async lesson(
  //  lessonWhereUniqueInput: Prisma.LessonWhereUniqueInput,
  //): Promise<Lesson[] | null> {
  //    return this.prisma.lesson.findUnique({where: lessonWhereUniqueInput});
  //}

  //async lessons(params: {
  //  skip?: number;
  //  take?: number;
  //  cursor?: Prisma.LessonWhereUniqueInput;
  //  where?: Prisma.LessonWhereInput;
  //  orderBy?: Prisma.LessonOrderByWithRelationInput;
  //}): Promise<Lesson[]> {
  //  const { skip, take, cursor, where, orderBy } = params;
  //  return this.prisma.lesson.findMany({
  //    skip,
  //    take,
  //    cursor,
  //    where,
  //    orderBy,
  //  });
  //}

  //async createLesson(data: Prisma.LessonCreateInput): Promise<Lesson> {
  //  return this.prisma.lesson.create({
  //    data,
  //  });
  //}

  //async updateLesson(params: {
  //  where: Prisma.lessonsWhereUniqueInput;
  //  data: Prisma.lessonsUpdateInput;
  //}): Promise<lessons> {
  //  const { where, data } = params;
  //  return this.prisma.lessons.update({
  //    data,
  //    where,
  //  });
  //}

  //async deleteLesson(where: Prisma.LessonWhereUniqueInput): Promise<Lesson> {
  //  return this.prisma.lessons.delete({
  //    where,
  //  });
  //}
