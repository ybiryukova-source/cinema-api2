import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
<<<<<<< HEAD
  ParseUUIDPipe,
=======
>>>>>>> origin/main
} from '@nestjs/common';

import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';

@ApiTags('Films')
@Controller('films')
export class FilmsController {
  constructor(
    private readonly filmsService: FilmsService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: Film })
  @ApiBadRequestResponse({
    description: 'Некоректні дані фільму',
  })
  create(@Body() dto: CreateFilmDto): Promise<Film> {
    return this.filmsService.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: [Film] })
  findAll(): Promise<Film[]> {
    return this.filmsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Film })
<<<<<<< HEAD
  @ApiBadRequestResponse({
    description: 'Некоректний UUID фільму',
  })
  @ApiNotFoundResponse({
    description: 'Фільм не знайдено',
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Film> {
=======
  @ApiNotFoundResponse({
    description: 'Фільм не знайдено',
  })
  findOne(@Param('id') id: string): Promise<Film> {
>>>>>>> origin/main
    return this.filmsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Film })
  @ApiBadRequestResponse({
<<<<<<< HEAD
    description: 'Некоректний UUID або дані для оновлення',
=======
    description: 'Некоректні дані для оновлення',
>>>>>>> origin/main
  })
  @ApiNotFoundResponse({
    description: 'Фільм не знайдено',
  })
  update(
<<<<<<< HEAD
    @Param('id', new ParseUUIDPipe()) id: string,
=======
    @Param('id') id: string,
>>>>>>> origin/main
    @Body() dto: UpdateFilmDto,
  ): Promise<Film> {
    return this.filmsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Фільм успішно видалено',
  })
<<<<<<< HEAD
  @ApiBadRequestResponse({
    description: 'Некоректний UUID фільму',
  })
=======
>>>>>>> origin/main
  @ApiNotFoundResponse({
    description: 'Фільм не знайдено',
  })
  @ApiConflictResponse({
    description: 'Фільм використовується в сеансах',
  })
<<<<<<< HEAD
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
=======
  remove(@Param('id') id: string): Promise<void> {
>>>>>>> origin/main
    return this.filmsService.remove(id);
  }
}