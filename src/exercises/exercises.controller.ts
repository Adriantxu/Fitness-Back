import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(private exerciseService: ExercisesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/:bodyId')
  async getExercises(@Param('bodyId') bodyId: string) {
    const bodyIdNumber = parseInt(bodyId, 10);

    if (
      isNaN(bodyIdNumber) ||
      !(await this.exerciseService.checkBodyPartIdExists(bodyIdNumber))
    ) {
      throw new ForbiddenException(
        'The exercises you requested are not accessible.',
      );
    }
    return await this.exerciseService.getExercisesFromBodyId(bodyIdNumber);
  }
}
