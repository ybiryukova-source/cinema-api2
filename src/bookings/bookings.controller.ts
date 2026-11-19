import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
  ) {}

  @Get()
  @ApiOkResponse({ type: [Booking] })
  findAll(): Promise<Booking[]> {
    return this.bookingsService.findAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({
    description: 'Бронювання не знайдено',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.bookingsService.remove(id);
  }
}

@ApiTags('Bookings')
@Controller('showings')
export class ShowingBookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
  ) {}

  @Post(':id/bookings')
  @ApiCreatedResponse({ type: Booking })
  @ApiBadRequestResponse({
    description: 'Некоректні або повторювані місця',
  })
  @ApiNotFoundResponse({
    description: 'Сеанс не знайдено',
  })
  @ApiConflictResponse({
    description: 'Місце вже заброньоване',
  })
  create(
    @Param('id') showingId: string,
    @Body() dto: CreateBookingDto,
  ): Promise<Booking> {
    return this.bookingsService.create(showingId, dto);
  }

  @Get(':id/bookings')
  @ApiOkResponse({ type: [Booking] })
  @ApiNotFoundResponse({
    description: 'Сеанс не знайдено',
  })
  findByShowing(
    @Param('id') showingId: string,
  ): Promise<Booking[]> {
    return this.bookingsService.findByShowing(showingId);
  }

  @Get(':id/seats')
  @ApiOkResponse({
    description: 'Місця залу з ознакою зайнятості',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          row: { type: 'integer', example: 1 },
          seat: { type: 'integer', example: 2 },
          isBooked: { type: 'boolean', example: true },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Сеанс не знайдено',
  })
  getSeats(
    @Param('id') showingId: string,
  ): Promise<
    { row: number; seat: number; isBooked: boolean }[]
  > {
    return this.bookingsService.getShowingSeats(showingId);
  }
}