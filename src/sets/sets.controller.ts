import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { validate } from 'class-validator';
import { Utils } from 'src/utils/middlewareHelper';
import { SetsService } from './sets.service';
import { setsCreateDto } from './dto';
import { WorkoutsService } from 'src/workouts/workouts.service';
import { ExercisesService } from 'src/exercises/exercises.service';

@Controller('sets')
export class SetsController {
  constructor(
    private setsService: SetsService,
    private workoutService: WorkoutsService,
    private exerciseService: ExercisesService,
    private utils: Utils,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createWorkout(@Req() req: Request, @Body() rawBody: setsCreateDto) {
    const user = this.utils.extractUserJwtMiddleware(req);
    const userId = user ? parseInt(user['sub'] as string) : null;
    const errors = await validate(rawBody);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    if (userId == null) {
      throw new ForbiddenException(
        'An error happend while retrieving information.',
      );
    }
    if (!this.workoutService.getWorkout(userId, rawBody.workoutId)) {
      throw new BadRequestException('Workout does not exist');
    }
    if (
      !(await this.exerciseService.getArrayExerciseId()).includes(
        rawBody.exerciseId,
      )
    ) {
      throw new BadRequestException('Exercise does not exist');
    }
    return await this.setsService.createSet(rawBody);
  }
}
