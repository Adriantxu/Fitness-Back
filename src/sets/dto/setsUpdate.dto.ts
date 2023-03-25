import { IsNumber, IsOptional } from 'class-validator';

export class setsUpdateDto {
  id: number;

  @IsNumber()
  @IsOptional()
  exerciseId?: number;

  @IsNumber()
  @IsOptional()
  reps?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;
}
