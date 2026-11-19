import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

import { CreateHallDto } from './dto/create-hall.dto';
import { Hall, HallWithSeats, Seat } from './entities/hall.entity';

@Injectable()
export class HallsService {
  constructor(
    @InjectRepository(Hall)
    private readonly hallsRepository: Repository<Hall>,
  ) {}

  async create(dto: CreateHallDto): Promise<Hall> {
    const exists = await this.hallsRepository.existsBy({
      name: dto.name,
    });

    if (exists) {
      throw new ConflictException(
        `Зал з назвою "${dto.name}" вже існує`,
      );
    }

    try {
      const hall = this.hallsRepository.create(dto);
      return await this.hallsRepository.save(hall);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as { code?: string };

        if (driverError.code === '23505') {
          throw new ConflictException(
            `Зал з назвою "${dto.name}" вже існує`,
          );
        }
      }

      throw error;
    }
  }

  async findAll(): Promise<Hall[]> {
    return this.hallsRepository.find();
  }

  async findOne(id: string): Promise<Hall> {
    const hall = await this.hallsRepository.findOneBy({ id });

    if (!hall) {
      throw new NotFoundException(
        `Зал з id ${id} не знайдено`,
      );
    }

    return hall;
  }

  getSeats(hall: Hall): Seat[] {
    const seats: Seat[] = [];

    for (let row = 1; row <= hall.rows; row++) {
      for (let seat = 1; seat <= hall.seatsPerRow; seat++) {
        seats.push({ row, seat });
      }
    }

    return seats;
  }

  async findOneWithSeats(id: string): Promise<HallWithSeats> {
    const hall = await this.findOne(id);

    return {
      ...hall,
      seats: this.getSeats(hall),
    };
  }

  async remove(id: string): Promise<void> {
    const hall = await this.findOne(id);

    const hasShowings = await this.hallsRepository
      .createQueryBuilder('hall')
      .innerJoin('hall.showings', 'showing')
      .where('hall.id = :id', { id })
      .getExists();

    if (hasShowings) {
      throw new ConflictException(
        'Неможливо видалити зал, оскільки для нього існують сеанси',
      );
    }

    try {
      await this.hallsRepository.remove(hall);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as { code?: string };

        if (driverError.code === '23503') {
          throw new ConflictException(
            'Неможливо видалити зал, оскільки для нього існують сеанси',
          );
        }
      }

      throw error;
    }
  }
}