import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
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

import { HallsService } from './halls.service';
import { CreateHallDto } from './dto/create-hall.dto';
import {
  Hall,
  HallWithSeats,
} from './entities/hall.entity';

@ApiTags('Halls')
@Controller('halls')
export class HallsController {
  constructor(
    private readonly hallsService: HallsService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: Hall })
  @ApiBadRequestResponse({
    description: 'Некоректні дані залу',
  })
  @ApiConflictResponse({
    description: 'Зал із такою назвою вже існує',
  })
  create(@Body() dto: CreateHallDto): Promise<Hall> {
    return this.hallsService.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: [Hall] })
  findAll(): Promise<Hall[]> {
    return this.hallsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: HallWithSeats })
  @ApiNotFoundResponse({
    description: 'Зал не знайдено',
  })
  findOne(
    @Param('id') id: string,
  ): Promise<HallWithSeats> {
    return this.hallsService.findOneWithSeats(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Зал успішно видалено',
  })
  @ApiNotFoundResponse({
    description: 'Зал не знайдено',
  })
  @ApiConflictResponse({
    description: 'Зал використовується в сеансах',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.hallsService.remove(id);
  }
}