import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateCinemaTables1763500000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto"',
    );

    await queryRunner.createTable(
      new Table({
        name: 'films',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'duration_minutes',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'release_year',
            type: 'integer',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'halls',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'rows',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'seats_per_row',
            type: 'integer',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'showings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'film_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'hall_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'starts_at',
            type: 'timestamptz',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'integer',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('showings', [
      new TableForeignKey({
        columnNames: ['film_id'],
        referencedTableName: 'films',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
      new TableForeignKey({
        columnNames: ['hall_id'],
        referencedTableName: 'halls',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    ]);

    await queryRunner.createTable(
      new Table({
        name: 'bookings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'showing_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'total_price',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['showing_id'],
        referencedTableName: 'showings',
        referencedColumnNames: ['id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'booking_seats',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'booking_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'showing_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'row',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'seat',
            type: 'integer',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('booking_seats', [
      new TableForeignKey({
        columnNames: ['booking_id'],
        referencedTableName: 'bookings',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['showing_id'],
        referencedTableName: 'showings',
        referencedColumnNames: ['id'],
      }),
    ]);

    await queryRunner.createIndex(
      'booking_seats',
      new TableIndex({
        name: 'IDX_booking_seats_showing_row_seat',
        columnNames: ['showing_id', 'row', 'seat'],
        isUnique: true,
      }),
    );
  }

  public async down(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.dropTable('booking_seats', true);
    await queryRunner.dropTable('bookings', true);
    await queryRunner.dropTable('showings', true);
    await queryRunner.dropTable('halls', true);
    await queryRunner.dropTable('films', true);
  }
}