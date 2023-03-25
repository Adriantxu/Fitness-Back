import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Utils } from 'src/utils/middlewareHelper';
import { workoutCreateDto } from './dto';
import { validate } from 'class-validator';

@Controller('workouts')
export class WorkoutsController {
  constructor(private utils: Utils) {}

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
    return 'createWorkout';
  }
}
