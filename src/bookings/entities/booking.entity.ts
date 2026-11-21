import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Showing } from '../../showings/entities/showing.entity';
import { Seat } from '../../halls/entities/hall.entity';
import { BookingSeat } from './booking-seat.entity';

@Entity('bookings')
export class Booking {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'showing_id', type: 'uuid' })
  showingId: string;

  @ApiProperty({ type: [Seat] })
  seats: Seat[];

  @ApiProperty({
    example: 25000,
    description: 'Загальна ціна в копійках',
  })
  @Column({ name: 'total_price', type: 'integer' })
  totalPrice: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @ManyToOne(() => Showing, (showing) => showing.bookings, {
    nullable: false,
  })
  @JoinColumn({ name: 'showing_id' })
  showing: Showing;

  @OneToMany(() => BookingSeat, (bookingSeat) => bookingSeat.booking)
  bookingSeats: BookingSeat[];
}