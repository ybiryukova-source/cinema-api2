import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HallsModule } from '../halls/halls.module';
import { ShowingsModule } from '../showings/showings.module';

import {
  BookingsController,
  ShowingBookingsController,
} from './bookings.controller';

import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { BookingSeat } from './entities/booking-seat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookingSeat]),
    ShowingsModule,
    HallsModule,
  ],
  controllers: [
    BookingsController,
    ShowingBookingsController,
  ],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}