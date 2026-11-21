
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmsService } from '../films/films.service';
import { HallsService } from '../halls/halls.service';

import { CreateShowingDto } from './dto/create-showing.dto';
import {
  FindShowingsQueryDto,
  ShowingSort,
} from './dto/find-showings-query.dto';
import { ShowingsPageDto } from './dto/showings-page.dto';
import {
  Showing,
  ShowingDetails,
} from './entities/showing.entity';

@Injectable()
export class ShowingsService {
  constructor(
    @InjectRepository(Showing)
    private readonly showingsRepository: Repository<Showing>,
    private readonly filmsService: FilmsService,
    private readonly hallsService: HallsService,
  ) {}

  async create(dto: CreateShowingDto): Promise<Showing> {
    const filmExists = await this.filmsService
      .findOne(dto.filmId)
      .then(() => true)
      .catch((error: unknown) => {
        if (error instanceof NotFoundException) return false;
        throw error;
      });

    if (!filmExists) {
      throw new BadRequestException(
        `Фільм з id ${dto.filmId} не знайдено`,
      );
    }

    const hallExists = await this.hallsService
      .findOne(dto.hallId)
      .then(() => true)
      .catch((error: unknown) => {
        if (error instanceof NotFoundException) return false;
        throw error;
      });

    if (!hallExists) {
      throw new BadRequestException(
        `Зал з id ${dto.hallId} не знайдено`,
      );
    }

    const startsAt = new Date(dto.startsAt);

    if (
      Number.isNaN(startsAt.getTime()) ||
      startsAt.getTime() <= Date.now()
    ) {
      throw new BadRequestException(
        'startsAt має бути коректною датою в майбутньому',
      );
    }

    const showing = this.showingsRepository.create({
      filmId: dto.filmId,
      hallId: dto.hallId,
      startsAt,
      price: dto.price,
    });

    return this.showingsRepository.save(showing);
  }

  async findAll(
    query: FindShowingsQueryDto,
  ): Promise<ShowingsPageDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sort = query.sort ?? ShowingSort.ASC;

    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException('Некоректний параметр page');
    }

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      throw new BadRequestException('Некоректний параметр limit');
    }

    if (sort !== ShowingSort.ASC && sort !== ShowingSort.DESC) {
      throw new BadRequestException('Некоректний параметр sort');
    }

    const qb = this.showingsRepository
      .createQueryBuilder('showing')
      .innerJoinAndSelect('showing.film', 'film')
      .innerJoinAndSelect('showing.hall', 'hall');

    if (query.filmId) {
      qb.andWhere('showing.filmId = :filmId', {
        filmId: query.filmId,
      });
    }

    if (query.date) {
      const date = query.date;
      const parsedDate = new Date(`${date}T00:00:00.000Z`);

      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== date
      ) {
        throw new BadRequestException(
          'date має бути коректною датою YYYY-MM-DD',
        );
      }

      const nextDate = new Date(
        parsedDate.getTime() + 24 * 60 * 60 * 1000,
      );

      qb.andWhere('showing.startsAt >= :startDate', {
        startDate: parsedDate,
      }).andWhere('showing.startsAt < :endDate', {
        endDate: nextDate,
      });
    }

    const direction = sort === ShowingSort.DESC ? 'DESC' : 'ASC';

    qb.orderBy('showing.startsAt', direction)
      .addOrderBy('showing.id', direction)
      .skip((page - 1) * limit)
      .take(limit);

    const [showings, total] = await qb.getManyAndCount();

    return {
      items: showings.map((showing) => this.toDetails(showing)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Showing> {
    const showing = await this.showingsRepository.findOneBy({ id });

    if (!showing) {
      throw new NotFoundException(
        `Сеанс з id ${id} не знайдено`,
      );
    }

    return showing;
  }

  async findOneDetails(id: string): Promise<ShowingDetails> {
    const showing = await this.showingsRepository.findOne({
      where: { id },
      relations: {
        film: true,
        hall: true,
      },
    });

    if (!showing) {
      throw new NotFoundException(
        `Сеанс з id ${id} не знайдено`,
      );
    }

    return this.toDetails(showing);
  }

  async hasFilm(filmId: string): Promise<boolean> {
    return this.showingsRepository.existsBy({ filmId });
  }

  async hasHall(hallId: string): Promise<boolean> {
    return this.showingsRepository.existsBy({ hallId });
  }

  private toDetails(showing: Showing): ShowingDetails {
    return {
      id: showing.id,
      filmTitle: showing.film.title,
      hallName: showing.hall.name,
      startsAt: showing.startsAt.toISOString(),
      price: showing.price,
    };
  }
}