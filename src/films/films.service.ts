import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';
import { Showing } from '../showings/entities/showing.entity';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
  ) {}

  async create(dto: CreateFilmDto): Promise<Film> {
    const film = this.filmsRepository.create(dto);
    return this.filmsRepository.save(film);
  }

  async findAll(): Promise<Film[]> {
    return this.filmsRepository.find();
  }

  async findOne(id: string): Promise<Film> {
    const film = await this.filmsRepository.findOneBy({ id });

    if (!film) {
      throw new NotFoundException(
        `Фільм з id ${id} не знайдено`,
      );
    }

    return film;
  }

  async update(id: string, dto: UpdateFilmDto): Promise<Film> {
    const film = await this.findOne(id);

    Object.assign(film, dto);

    return this.filmsRepository.save(film);
  }

  async remove(id: string): Promise<void> {
    const film = await this.findOne(id);

    const hasShowings = await this.filmsRepository
      .createQueryBuilder('film')
      .innerJoin(Showing, 'showing', 'showing.filmId = film.id')
      .where('film.id = :id', { id })
      .getExists();

    if (hasShowings) {
      throw new ConflictException(
        'Неможливо видалити фільм, оскільки для нього існують сеанси',
      );
    }

    try {
      await this.filmsRepository.remove(film);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as {
          code?: string;
        };

        if (driverError.code === '23503') {
          throw new ConflictException(
            'Неможливо видалити фільм, оскільки для нього існують сеанси',
          );
        }
      }

      throw error;
    }
  }
}