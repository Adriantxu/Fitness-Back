import { Injectable } from '@nestjs/common';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';
import { workoutCreateDto } from './dto';

@Injectable()
export class WorkoutsService {
  constructor(private prismaService: PrismaDbService) {}

  async createWorkout(userId: number, dto: workoutCreateDto) {
    const workout = await this.prismaService.workoutPlan.create({
      data: {
        name: dto.name,
        userId,
        date: '',
      },
    });
    return workout;
  }
}
