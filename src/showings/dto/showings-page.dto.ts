import { ApiProperty } from '@nestjs/swagger';
import { ShowingDetails } from '../entities/showing.entity';

export class ShowingsPageDto {
  @ApiProperty({
    type: [ShowingDetails],
    description: 'Сеанси поточної сторінки',
  })
  items: ShowingDetails[];

  @ApiProperty({
    example: 4,
    description: 'Загальна кількість сеансів за фільтрами',
  })
  total: number;

  @ApiProperty({
    example: 1,
    description: 'Номер поточної сторінки',
  })
  page: number;

  @ApiProperty({
    example: 20,
    description: 'Кількість записів на сторінці',
  })
  limit: number;
}