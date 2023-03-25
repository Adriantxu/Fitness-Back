import { Injectable } from '@nestjs/common';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';
import { WorkoutsService } from 'src/workouts/workouts.service';
import { setsCreateDto } from './dto/setsCreate.dto';

@Injectable()
export class SetsService {
  constructor(
    private workoutService: WorkoutsService,
    private prismaService: PrismaDbService,
  ) {}

  async createSet(dto: setsCreateDto) {
    const date = await this.workoutService.getWorkoutDate(dto.workoutId);

    const set = await this.prismaService.set.create({
      data: {
        reps: dto.reps,
        weight: dto.weight,
        date: date.date,
        workoutId: dto.workoutId,
        exerciseId: dto.exerciseId,
      },
    });
    const setWorkout = await this.prismaService.workout_Set.create({
      data: {
        workoutPlanId: dto.workoutId,
        setId: set.id,
      },
    });
    return { ...set, ...setWorkout };
  }
}
