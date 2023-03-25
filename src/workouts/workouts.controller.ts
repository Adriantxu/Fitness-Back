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
import { Utils } from 'src/utils/middlewareHelper';
import { workoutCreateDto } from './dto';
import { validate } from 'class-validator';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {
  constructor(private workoutsService: WorkoutsService, private utils: Utils) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createWorkout(@Req() req: Request, @Body() rawBody: workoutCreateDto) {
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
    return await this.workoutsService.createWorkout(userId, rawBody);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getWorkouts(@Req() req: Request) {
    const user = this.utils.extractUserJwtMiddleware(req);
    const userId = user ? parseInt(user['sub'] as string) : null;

    if (userId == null)
      throw new ForbiddenException(
        'An error happend while retrieving information.',
      );
    return await this.workoutsService.getWorkouts(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getWorkout(@Req() req: Request, @Param('id') workoutId: string) {
    const user = this.utils.extractUserJwtMiddleware(req);
    const userId = user ? parseInt(user['sub'] as string) : null;
    const workoutIdNumber = parseInt(workoutId.substring(1), 10);

    if (workoutIdNumber.toString() === 'NaN') {
      throw new BadRequestException('Workout does not exist');
    }
    if (userId == null)
      throw new ForbiddenException(
        'An error happend while retrieving information.',
      );
    const exist = await this.workoutsService.getWorkout(
      userId,
      workoutIdNumber,
    );
    if (!exist) throw new BadRequestException('Workout does not exist');
    return exist;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  async updateWorkout(
    @Req() req: Request,
    @Param('id') workoutId: string,
    @Body('name') name: string,
  ) {
    const user = this.utils.extractUserJwtMiddleware(req);
    const userId = user ? parseInt(user['sub'] as string) : null;
    const workoutIdNumber = parseInt(workoutId.substring(1), 10);

    if (workoutIdNumber.toString() === 'NaN') {
      throw new BadRequestException('Workout does not exist');
    }
    if (userId == null)
      throw new ForbiddenException(
        'An error happend while retrieving information.',
      );
    const exist = await this.workoutsService.getWorkout(
      userId,
      workoutIdNumber,
    );
    if (!exist) throw new BadRequestException('Workout does not exist');
    return await this.workoutsService.updateWorkout(workoutIdNumber, name);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteWorkout(@Req() req: Request, @Param('id') workoutId: string) {
    const user = this.utils.extractUserJwtMiddleware(req);
    const userId = user ? parseInt(user['sub'] as string) : null;
    const workoutIdNumber = parseInt(workoutId.substring(1), 10);

    if (workoutIdNumber.toString() === 'NaN') {
      throw new BadRequestException('Workout does not exist');
    }
    if (userId == null)
      throw new ForbiddenException(
        'An error happend while retrieving information.',
      );
    const exist = await this.workoutsService.getWorkout(
      userId,
      workoutIdNumber,
    );
    if (!exist) throw new BadRequestException('Workout does not exist');
    return await this.workoutsService.deleteWorkout(workoutIdNumber);
  }
}
