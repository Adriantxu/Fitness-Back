import { Injectable } from '@nestjs/common';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaDbService) {}

  async getExercisesFromBodyId(bodyId: number) {
    const exercises = await this.prisma.exercise.findMany({
      where: { bodyPartId: bodyId },
    });
    const bodyPart = await this.getBodyPartFromId(bodyId);
    exercises.map((item) => {
      delete item.bodyPartId;
    });
    return { [bodyPart.name]: exercises };
  }

  async checkBodyPartIdExists(bodyId: number) {
    const exist = this.prisma.bodyPart.findFirst({
      where: { id: bodyId },
    });
    return exist ? true : false;
  }

  async getBodyPartFromId(bodyId) {
    return this.prisma.bodyPart.findFirst({
      where: { id: bodyId },
      select: { name: true },
    });
  }
}
