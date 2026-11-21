import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Showing } from '../../showings/entities/showing.entity';

export class Seat {
  @ApiProperty({ example: 1 })
  row: number;

  @ApiProperty({ example: 1 })
  seat: number;
}

@Entity('halls')
export class Hall {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Зал №1' })
  @Column({ type: 'varchar', unique: true })
  name: string;

  @ApiProperty({ example: 3 })
  @Column({ type: 'integer' })
  rows: number;

  @ApiProperty({ example: 5 })
  @Column({ name: 'seats_per_row', type: 'integer' })
  seatsPerRow: number;

  @OneToMany(() => Showing, (showing) => showing.hall)
  showings: Showing[];
}

export class HallWithSeats extends Hall {
  @ApiProperty({ type: [Seat] })
  seats: Seat[];
}