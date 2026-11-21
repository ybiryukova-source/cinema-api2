import 'reflect-metadata';
import AppDataSource from './data-source';

import { Film } from './films/entities/film.entity';
import { Hall } from './halls/entities/hall.entity';
import { Showing } from './showings/entities/showing.entity';
import { Booking } from './bookings/entities/booking.entity';
import { BookingSeat } from './bookings/entities/booking-seat.entity';

async function seed(): Promise<void> {
  await AppDataSource.initialize();

  try {
    await AppDataSource.transaction(async (manager) => {
      const filmRepository = manager.getRepository(Film);
      const hallRepository = manager.getRepository(Hall);
      const showingRepository = manager.getRepository(Showing);
      const bookingRepository = manager.getRepository(Booking);
      const bookingSeatRepository =
        manager.getRepository(BookingSeat);

      // 1. Фільми
      const filmData = [
        {
          title: 'Interstellar',
          durationMinutes: 169,
          releaseYear: 2014,
        },
        {
          title: 'Inception',
          durationMinutes: 148,
          releaseYear: 2010,
        },
      ];

      const films: Film[] = [];

      for (const data of filmData) {
        let film = await filmRepository.findOneBy({
          title: data.title,
          releaseYear: data.releaseYear,
        });

        if (!film) {
          film = await filmRepository.save(
            filmRepository.create(data),
          );
        }

        films.push(film);
      }

      // 2. Кінозали
      const hallData = [
        {
          name: 'Зал №1',
          rows: 5,
          seatsPerRow: 8,
        },
        {
          name: 'Зал №2',
          rows: 4,
          seatsPerRow: 6,
        },
      ];

      const halls: Hall[] = [];

      for (const data of hallData) {
        let hall = await hallRepository.findOneBy({
          name: data.name,
        });

        if (!hall) {
          hall = await hallRepository.save(
            hallRepository.create(data),
          );
        }

        halls.push(hall);
      }

      // 3. Сеанси
      // Постійні UUID дозволяють розпізнавати
      // тестові сеанси незалежно від дати запуску.
      const showingData = [
        {
          id: '10000000-0000-4000-8000-000000000001',
          filmId: films[0].id,
          hallId: halls[0].id,
          startsAt: new Date('2030-03-01T18:00:00.000Z'),
          price: 15000,
        },
        {
          id: '10000000-0000-4000-8000-000000000002',
          filmId: films[1].id,
          hallId: halls[1].id,
          startsAt: new Date('2030-03-02T18:00:00.000Z'),
          price: 18000,
        },
        {
          id: '10000000-0000-4000-8000-000000000003',
          filmId: films[0].id,
          hallId: halls[1].id,
          startsAt: new Date('2030-03-03T18:00:00.000Z'),
          price: 16000,
        },
        {
          id: '10000000-0000-4000-8000-000000000004',
          filmId: films[1].id,
          hallId: halls[0].id,
          startsAt: new Date('2030-03-04T18:00:00.000Z'),
          price: 20000,
        },
      ];

      const showings: Showing[] = [];

      for (const data of showingData) {
        // Спочатку шукаємо за постійним UUID.
        let showing = await showingRepository.findOneBy({
          id: data.id,
        });

        // Сумісність із сеансами, створеними
        // попередньою версією seed.ts.
        if (!showing) {
          showing = await showingRepository.findOne({
            where: {
              filmId: data.filmId,
              hallId: data.hallId,
              startsAt: data.startsAt,
            },
          });
        }

        if (!showing) {
          // Якщо в базі вже є тестові сеанси
          // з попереднього seed, використовуємо їх.
          const previousShowings =
            await showingRepository.find({
              where: {
                filmId: data.filmId,
                hallId: data.hallId,
                price: data.price,
              },
              order: {
                startsAt: 'ASC',
              },
            });

          showing = previousShowings[0] ?? null;
        }

        if (!showing) {
          showing = await showingRepository.save(
            showingRepository.create(data),
          );
        }

        showings.push(showing);
      }

      // 4. Тестове бронювання
      const firstShowing = showings[0];

      const existingSeat =
        await bookingSeatRepository.findOneBy({
          showingId: firstShowing.id,
          row: 1,
          seat: 1,
        });

      if (!existingSeat) {
        const booking = await bookingRepository.save(
          bookingRepository.create({
            showingId: firstShowing.id,
            totalPrice: firstShowing.price,
          }),
        );

        await bookingSeatRepository.save(
          bookingSeatRepository.create({
            bookingId: booking.id,
            showingId: firstShowing.id,
            row: 1,
            seat: 1,
          }),
        );
      }
    });

    console.log('Seed успішно виконано!');
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error('Помилка під час виконання seed:', error);
  process.exitCode = 1;
});