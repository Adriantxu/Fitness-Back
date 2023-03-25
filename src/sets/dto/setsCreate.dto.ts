import { IsNumber } from 'class-validator';

export class setsCreateDto {
  @IsNumber()
  workoutId: number;

  @IsNumber()
  exerciseId: number;

  @IsNumber()
  reps: number;

  @IsNumber()
  weight: number;
}
