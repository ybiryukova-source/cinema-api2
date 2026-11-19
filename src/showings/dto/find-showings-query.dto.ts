import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsInt,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

@ValidatorConstraint({
  name: 'isValidCalendarDate',
  async: false,
})
class IsValidCalendarDate
  implements ValidatorConstraintInterface
{
  validate(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }

  defaultMessage(): string {
    return 'date має бути коректною датою у форматі YYYY-MM-DD';
  }
}

export enum ShowingSort {
  ASC = 'asc',
  DESC = 'desc',
}

export class FindShowingsQueryDto {
  @ApiPropertyOptional({
    description: 'ID фільму',
    format: 'uuid',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  filmId?: string;

  @ApiPropertyOptional({
    example: '2027-01-15',
    description: 'Дата у форматі YYYY-MM-DD',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date має бути у форматі YYYY-MM-DD',
  })
  @Validate(IsValidCalendarDate)
  date?: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    minimum: 1,
    description: 'Номер сторінки',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
    description: 'Кількість сеансів на сторінці',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({
    enum: ShowingSort,
    default: ShowingSort.ASC,
    description: 'Сортування за часом початку сеансу',
  })
  @IsOptional()
  @IsEnum(ShowingSort)
  sort: ShowingSort = ShowingSort.ASC;
}