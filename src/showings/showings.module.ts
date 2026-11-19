import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmsModule } from '../films/films.module';
import { HallsModule } from '../halls/halls.module';

import { ShowingsController } from './showings.controller';
import { ShowingsService } from './showings.service';
import { Showing } from './entities/showing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Showing]),
    forwardRef(() => FilmsModule),
    forwardRef(() => HallsModule),
  ],
  controllers: [ShowingsController],
  providers: [ShowingsService],
  exports: [ShowingsService],
})
export class ShowingsModule {}