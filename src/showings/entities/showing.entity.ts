import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Film } from '../../films/entities/film.entity';
import { Hall } from '../../halls/entities/hall.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('showings')
export class Showing {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'film_id', type: 'uuid' })
  filmId: string;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'hall_id', type: 'uuid' })
  hallId: string;

  @ApiProperty({ example: '2027-01-15T18:00:00.000Z' })
  @Column({ name: 'starts_at', type: 'timestamptz' })
  startsAt: Date;

  @ApiProperty({ example: 12500 })
  @Column({ type: 'integer' })
  price: number;

  @ManyToOne(() => Film, (film) => film.showings, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'film_id' })
  film: Film;

  @ManyToOne(() => Hall, (hall) => hall.showings, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;

  @OneToMany(() => Booking, (booking) => booking.showing)
  bookings: Booking[];
}

export class ShowingDetails {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Interstellar' })
  filmTitle: string;

  @ApiProperty({ example: 'Зал №1' })
  hallName: string;

  @ApiProperty({ example: '2027-01-15T18:00:00.000Z' })
  startsAt: string;

  @ApiProperty({ example: 12500 })
  price: number;
}