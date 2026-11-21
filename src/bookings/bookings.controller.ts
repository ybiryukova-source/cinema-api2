import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
<<<<<<< HEAD
  ParseUUIDPipe,
=======
>>>>>>> origin/main
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
<<<<<<< HEAD
  @ApiBadRequestResponse({
    description: 'Некоректний UUID бронювання',
  })
  @ApiNotFoundResponse({
    description: 'Бронювання не знайдено',
  })
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
=======
  @ApiNotFoundResponse({
    description: 'Бронювання не знайдено',
  })
  remove(@Param('id') id: string): Promise<void> {
>>>>>>> origin/main
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
<<<<<<< HEAD
    description: 'Некоректний UUID або некоректні чи повторювані місця',
=======
    description: 'Некоректні або повторювані місця',
>>>>>>> origin/main
  })
  @ApiNotFoundResponse({
    description: 'Сеанс не знайдено',
  })
  @ApiConflictResponse({
    description: 'Місце вже заброньоване',
  })
  create(
<<<<<<< HEAD
    @Param('id', new ParseUUIDPipe()) showingId: string,
=======
    @Param('id') showingId: string,
>>>>>>> origin/main
    @Body() dto: CreateBookingDto,
  ): Promise<Booking> {
    return this.bookingsService.create(showingId, dto);
  }

  @Get(':id/bookings')
  @ApiOkResponse({ type: [Booking] })
<<<<<<< HEAD
  @ApiBadRequestResponse({
    description: 'Некоректний UUID сеансу',
  })
=======
>>>>>>> origin/main
  @ApiNotFoundResponse({
    description: 'Сеанс не знайдено',
  })
  findByShowing(
<<<<<<< HEAD
    @Param('id', new ParseUUIDPipe()) showingId: string,
=======
    @Param('id') showingId: string,
>>>>>>> origin/main
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
<<<<<<< HEAD
  @ApiBadRequestResponse({
    description: 'Некоректний UUID сеансу',
  })
=======
>>>>>>> origin/main
  @ApiNotFoundResponse({
    description: 'Сеанс не знайдено',
  })
  getSeats(
<<<<<<< HEAD
    @Param('id', new ParseUUIDPipe()) showingId: string,
=======
    @Param('id') showingId: string,
>>>>>>> origin/main
  ): Promise<
    { row: number; seat: number; isBooked: boolean }[]
  > {
    return this.bookingsService.getShowingSeats(showingId);
  }
}