import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  QueryFailedError,
  Repository,
} from 'typeorm';

import { HallsService } from '../halls/halls.service';
import { ShowingsService } from '../showings/showings.service';
import { Seat } from '../halls/entities/hall.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { BookingSeat } from './entities/booking-seat.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,

    @InjectRepository(BookingSeat)
    private readonly bookingSeatsRepository: Repository<BookingSeat>,

    private readonly dataSource: DataSource,
    private readonly showingsService: ShowingsService,
    private readonly hallsService: HallsService,
  ) {}

  private toResponse(booking: Booking): Booking {
    return {
      ...booking,
      seats: (booking.bookingSeats ?? []).map(
        ({ row, seat }) => ({ row, seat }),
      ),
    };
  }

  async findAll(): Promise<Booking[]> {
    const bookings = await this.bookingsRepository.find({
      relations: { bookingSeats: true },
    });

    return bookings.map((booking) => this.toResponse(booking));
  }

  async findByShowing(showingId: string): Promise<Booking[]> {
    await this.showingsService.findOne(showingId);

    const bookings = await this.bookingsRepository.find({
      where: { showingId },
      relations: { bookingSeats: true },
    });

    return bookings.map((booking) => this.toResponse(booking));
  }

  async create(
    showingId: string,
    dto: CreateBookingDto,
  ): Promise<Booking> {
    const showing = await this.showingsService.findOne(showingId);
    const hall = await this.hallsService.findOne(showing.hallId);

    const requestedSeats = new Set<string>();

    for (const seat of dto.seats) {
      const key = `${seat.row}:${seat.seat}`;

      if (requestedSeats.has(key)) {
        throw new BadRequestException(
          `Місце ${key} повторюється в запиті`,
        );
      }

      requestedSeats.add(key);

      if (
        seat.row < 1 ||
        seat.row > hall.rows ||
        seat.seat < 1 ||
        seat.seat > hall.seatsPerRow
      ) {
        throw new BadRequestException(
          `Місце ${key} не існує в залі`,
        );
      }
    }

    try {
      const booking = await this.dataSource.transaction(
        async (manager) => {
          const newBooking = manager.create(Booking, {
            showingId,
            totalPrice: showing.price * dto.seats.length,
          });

          const savedBooking = await manager.save(
            Booking,
            newBooking,
          );

          const seats = dto.seats.map((seat) =>
            manager.create(BookingSeat, {
              bookingId: savedBooking.id,
              showingId,
              row: seat.row,
              seat: seat.seat,
            }),
          );

          await manager.save(BookingSeat, seats);

          savedBooking.bookingSeats = seats;

          return savedBooking;
        },
      );

      return this.toResponse(booking);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as {
          code?: string;
          constraint?: string;
        };

        if (
          driverError.code === '23505' &&
          driverError.constraint ===
            'IDX_booking_seats_showing_row_seat'
        ) {
          throw new ConflictException(
            'Одне або кілька місць уже заброньовані',
          );
        }
      }

      throw error;
    }
  }

  async getShowingSeats(
    showingId: string,
  ): Promise<
    { row: number; seat: number; isBooked: boolean }[]
  > {
    const showing = await this.showingsService.findOne(showingId);
    const hall = await this.hallsService.findOne(showing.hallId);

    const bookedSeats = await this.bookingSeatsRepository.find({
      where: { showingId },
    });

    const occupiedSeats = new Set(
      bookedSeats.map((seat) => `${seat.row}:${seat.seat}`),
    );

    return this.hallsService.getSeats(hall).map((seat: Seat) => ({
      ...seat,
      isBooked: occupiedSeats.has(`${seat.row}:${seat.seat}`),
    }));
  }

  async remove(id: string): Promise<void> {
    const booking = await this.bookingsRepository.findOneBy({
      id,
    });

    if (!booking) {
      throw new NotFoundException(
        `Бронювання з id ${id} не знайдено`,
      );
    }

    await this.bookingsRepository.delete(id);
  }
}