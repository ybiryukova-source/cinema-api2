import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { ShowingsService } from './showings.service';
import { CreateShowingDto } from './dto/create-showing.dto';
import { FindShowingsQueryDto } from './dto/find-showings-query.dto';
import { ShowingsPageDto } from './dto/showings-page.dto';

import {
  Showing,
  ShowingDetails,
} from './entities/showing.entity';

@ApiTags('Showings')
@Controller('showings')
export class ShowingsController {
  constructor(
    private readonly showingsService: ShowingsService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: Showing })
  @ApiBadRequestResponse({
    description: 'Некоректні дані або неіснуючий фільм чи зал',
  })
  create(
    @Body() dto: CreateShowingDto,
  ): Promise<Showing> {
    return this.showingsService.create(dto);
  }

  @Get()
  @ApiOkResponse({
    type: ShowingsPageDto,
    description: 'Список сеансів із пагінацією',
  })
  @ApiBadRequestResponse({
    description: 'Некоректні параметри фільтрації або пагінації',
  })
  findAll(
    @Query() query: FindShowingsQueryDto,
  ): Promise<ShowingsPageDto> {
    return this.showingsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: ShowingDetails })
<<<<<<< HEAD
  @ApiBadRequestResponse({
    description: 'Некоректний UUID сеансу',
  })
=======
>>>>>>> origin/main
  @ApiNotFoundResponse({
    description: 'Сеанс не знайдено',
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ShowingDetails> {
    return this.showingsService.findOneDetails(id);
  }
}