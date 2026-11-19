import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Showing } from '../../showings/entities/showing.entity';

@Entity('films')
export class Film {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Interstellar' })
  @Column({ type: 'varchar' })
  title: string;

  @ApiProperty({ example: 169 })
  @Column({ name: 'duration_minutes', type: 'integer' })
  durationMinutes: number;

  @ApiProperty({ example: 2014 })
  @Column({ name: 'release_year', type: 'integer' })
  releaseYear: number;

  @OneToMany(() => Showing, (showing) => showing.film)
  showings: Showing[];
}