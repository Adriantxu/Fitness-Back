import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { validate } from 'class-validator';
import { Utils } from 'src/utils/middlewareHelper';
import { SetsService } from './sets.service';
import { setsCreateDto, setsUpdateDto } from './dto';
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/:exerciseId')
  async getSets(
    @Req() req: Request,
    @Param('exerciseId') exerciseToSearch: string,
  ) {
    const user = this.utils.extractUserJwtMiddleware(req);
    const userId = user ? parseInt(user['sub'] as string) : null;
    const exerciseId = parseInt(exerciseToSearch.substring(1), 10);

    if (exerciseId.toString() === 'NaN') {
      throw new BadRequestException('Exercise does not exist');
    }
    if (userId == null)
      throw new ForbiddenException(
        'An error happend while retrieving information.',
      );
    return await this.setsService.getSets(userId, exerciseId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  async updateSet(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() rawBody: setsUpdateDto,
  ) {
    const user = this.utils.extractUserJwtMiddleware(req);
    const userId = user ? parseInt(user['sub'] as string) : null;
    const setId = parseInt(id.substring(1), 10);
    const errors = await validate(rawBody);

    if (setId.toString() === 'NaN') {
      throw new BadRequestException('Set does not exist');
    }
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    if (userId == null)
      throw new ForbiddenException(
        'An error happend while retrieving information.',
      );
    if (!(await this.setsService.checkSetFromUsersWorkouts(userId, setId))) {
      throw new BadRequestException('Set does not exist');
    }
    return await this.setsService.updateSet({ ...rawBody, id: setId });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteSet(@Req() req: Request, @Param('id') id: string) {
    const user = this.utils.extractUserJwtMiddleware(req);
    const userId = user ? parseInt(user['sub'] as string) : null;
    const setId = parseInt(id.substring(1), 10);

    if (setId.toString() === 'NaN') {
      throw new BadRequestException('Set does not exist');
    }
    if (userId == null)
      throw new ForbiddenException(
        'An error happend while retrieving information.',
      );
    if (!(await this.setsService.checkSetFromUsersWorkouts(userId, setId))) {
      throw new BadRequestException('Set does not exist');
    }
    return await this.setsService.deleteSet(setId);
  }
}
