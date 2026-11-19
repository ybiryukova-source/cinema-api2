import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Film } from './films/entities/film.entity';
import { Hall } from './halls/entities/hall.entity';
import { Showing } from './showings/entities/showing.entity';
import { Booking } from './bookings/entities/booking.entity';
import { BookingSeat } from './bookings/entities/booking-seat.entity';

const requiredEnvVariables = [
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB',
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(
      `Відсутня змінна середовища: ${variable}`,
    );
  }
}

const postgresPort = Number(process.env.POSTGRES_PORT);

if (
  !Number.isInteger(postgresPort) ||
  postgresPort < 1 ||
  postgresPort > 65535
) {
  throw new Error('Некоректний POSTGRES_PORT');
}

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: postgresPort,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  entities: [Film, Hall, Showing, Booking, BookingSeat],

  migrations: ['src/migrations/*.ts'],

  synchronize: false,
  uuidExtension: 'pgcrypto',
});