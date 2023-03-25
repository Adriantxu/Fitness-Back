import { IsString } from 'class-validator';

export class workoutCreateDto {
  @IsString()
  name: string;
}
