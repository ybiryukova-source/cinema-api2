import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

import { Booking } from './booking.entity';
import { Showing } from '../../showings/entities/showing.entity';

@Entity('booking_seats')
@Index(
  'IDX_booking_seats_showing_row_seat',
  ['showingId', 'row', 'seat'],
  { unique: true },
)
export class BookingSeat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'booking_id', type: 'uuid' })
  bookingId: string;

  @Column({ name: 'showing_id', type: 'uuid' })
  showingId: string;

  @Column({ type: 'integer' })
  row: number;

  @Column({ type: 'integer' })
  seat: number;

  @ManyToOne(() => Booking, (booking) => booking.bookingSeats, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ManyToOne(() => Showing, {
    nullable: false,
  })
  @JoinColumn({ name: 'showing_id' })
  showing: Showing;
}