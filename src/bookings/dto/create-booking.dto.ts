import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
  ArrayUnique,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SeatDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  row: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsPositive()
  seat: number;
}

export class CreateBookingDto {
  @ApiProperty({
    type: [SeatDto],
    example: [
      { row: 1, seat: 2 },
      { row: 1, seat: 3 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique(
    (seat: SeatDto) => `${seat.row}:${seat.seat}`,
    { message: 'У списку є повторювані місця' },
  )
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];
}