import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateShowingDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  filmId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  hallId: string;

  @ApiProperty({
    example: '2027-01-15T18:00:00.000Z',
    description: 'Дата та час початку сеансу',
  })
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  startsAt: string;

  @ApiProperty({
    example: 12500,
    description: 'Ціна квитка в копійках',
  })
  @IsInt()
  @IsPositive()
  price: number;
}