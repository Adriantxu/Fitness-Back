import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ExercisesService } from './exercises.service';

@ApiTags('exercises')
@Controller('exercises')
export class ExercisesController {
  constructor(private exerciseService: ExercisesService) {}

  @ApiOperation({ summary: 'Get exercises by body part ID' })
  @ApiParam({
    name: 'bodyId',
    required: true,
    type: 'integer',
    description: 'The ID of the body part to get exercises for',
  })
  @ApiOkResponse({
    description: 'The exercises for the specified body part',
    schema: {
      properties: {
        Arms: {
          type: 'array',
          example: [
            {
              id: 15,
              name: 'Bicep curls',
              description:
                'Isolation exercise for the biceps. Grasp dumbbells with an underhand grip and curl them upward to the shoulders.',
            },
          ],
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'The exercises you requested are not accessible.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/:bodyId')
  async getExercises(@Param('bodyId') bodyId: string) {
    const bodyIdNumber =
      bodyId[0] === ':'
        ? parseInt(bodyId.substring(1), 10)
        : parseInt(bodyId, 10);

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
