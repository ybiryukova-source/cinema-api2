import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateHallDto {
  @ApiProperty({ example: 'Зал №1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsPositive()
  rows: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsPositive()
  seatsPerRow: number;
}