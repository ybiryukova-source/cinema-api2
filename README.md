# Cinema API
REST API для керування кінотеатром на NestJS, TypeScript, PostgreSQL та TypeORM.
Домашнє завдання №2.

## Технології
- NestJS, TypeScript
- PostgreSQL, TypeORM
- Docker Compose
- Swagger
- class-validator, class-transformer

## Функціональність
- CRUD для фільмів.
- Створення, перегляд і видалення залів.
- Створення та перегляд сеансів.
- Фільтрація, пагінація та сортування сеансів.
- Бронювання та скасування бронювань.
- Захист від подвійного бронювання.
- Транзакції та валідація даних.
- Глобальна обробка помилок.

## Встановлення та запуск
Встановити залежності:

```bash
npm install
```

Створити `.env` на основі `.env.example`:

```env
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=cinema
POSTGRES_PASSWORD=cinema_dev_password
POSTGRES_DB=cinema
```

Запустити PostgreSQL:

```bash
docker compose up -d
```

Виконати міграції:

```bash
npm run migration:run
```

Заповнити базу тестовими даними:

```bash
npm run seed
```

Запустити сервер:

```bash
npm run start:dev
```

## API
Swagger: http://localhost:3000/docs

Основні маршрути:

- `/films` — керування фільмами.
- `/halls` — керування залами.
- `/showings` — сеанси, фільтрація та пагінація.
- `/showings/:id/bookings` — бронювання місць.
- `/showings/:id/seats` — місця сеансу.
- `/bookings` — перегляд і скасування бронювань.

Приклад пагінації:

```http
GET /showings?page=1&limit=2&sort=asc
```

## База даних
PostgreSQL містить 5 таблиць:

- `films`
- `halls`
- `showings`
- `bookings`
- `booking_seats`

Міграції знаходяться в `src/migrations`.

Seed знаходиться в `src/seed.ts` і підтримує повторний запуск без дублювання тестових даних.

## Перевірка API
Приклади запитів і помилок 400, 404 та 409 містяться у файлі `requests.http`.