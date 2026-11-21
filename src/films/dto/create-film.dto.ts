import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({ example: 'Interstellar' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 169 })
  @IsInt()
  @IsPositive()
  durationMinutes: number;

  @ApiProperty({ example: 2014 })
  @IsInt()
  releaseYear: number;
}