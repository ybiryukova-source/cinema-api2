import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { ShowingsModule } from '../showings/showings.module';
import { Film } from './entities/film.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Film]),
    forwardRef(() => ShowingsModule),
  ],
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {}