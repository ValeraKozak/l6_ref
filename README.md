# Lab 6 API Service

[![CI](https://github.com/ValeraKozak/l6_ref/actions/workflows/ci.yml/badge.svg)](https://github.com/ValeraKozak/l6_ref/actions/workflows/ci.yml)

Цей репозиторій містить невеликий REST API на Node.js та Express, який працює з MongoDB. Проєкт підготовлений для локального запуску, запуску через Docker Compose, автоматичного тестування та перевірки якості коду в GitHub Actions.

## Зміст

1. [Опис проєкту](#опис-проєкту)
2. [Технології](#технології)
3. [Структура проєкту](#структура-проєкту)
4. [Архітектура](#архітектура)
5. [Змінні середовища](#змінні-середовища)
6. [Локальний запуск](#локальний-запуск)
7. [Запуск через Docker Compose](#запуск-через-docker-compose)
8. [Тести](#тести)
9. [Документація API](#документація-api)
10. [Опис endpoint-ів](#опис-endpoint-ів)
11. [Приклади запитів](#приклади-запитів)
12. [CI/CD](#cicd)
13. [Типові проблеми](#типові-проблеми)

## Опис проєкту

Проєкт реалізує простий сервіс для роботи з елементами списку. Кожен елемент має:

- `id`
- `name`
- `description`

Сервіс надає API для:

- перевірки працездатності
- створення нового елемента
- отримання списку елементів
- отримання одного елемента за `id`

Окремої frontend-частини в проєкті немає. Для взаємодії з API можна використовувати:

- браузерну документацію `Swagger UI`
- Postman
- PowerShell
- `curl`

## Технології

У проєкті використано:

- `Node.js 22`
- `Express`
- `MongoDB`
- `Docker`
- `Docker Compose`
- `Jest`
- `Supertest`
- `ESLint`
- `GitHub Actions`
- `swagger-ui-express`

## Структура проєкту

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── repositories/
│   │   ├── inMemoryItemRepository.js
│   │   └── itemRepository.js
│   ├── app.js
│   ├── config.js
│   ├── db.js
│   ├── openapi.js
│   └── server.js
├── tests/
│   ├── app.test.js
│   └── mongodb.integration.test.js
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yaml
├── Dockerfile
├── Dockerfile.test
├── eslint.config.js
├── package-lock.json
├── package.json
├── README.md
└── REPORT.md
```

### Основні файли

- `src/server.js` — точка входу в застосунок
- `src/app.js` — конфігурація Express і опис endpoint-ів
- `src/config.js` — зчитування конфігурації з `.env`
- `src/db.js` — підключення до MongoDB і очікування готовності БД
- `src/repositories/itemRepository.js` — робота з реальною MongoDB
- `src/repositories/inMemoryItemRepository.js` — in-memory реалізація для unit/API-тестів
- `src/openapi.js` — OpenAPI-опис для `/docs`
- `tests/app.test.js` — базові API-тести
- `tests/mongodb.integration.test.js` — інтеграційний тест із реальною MongoDB

## Архітектура

Проєкт складається з трьох основних частин:

1. HTTP API на Express
2. MongoDB як сховище даних
3. окреме тестове оточення для автоматичної перевірки

Під час запуску:

1. сервіс читає налаштування з `.env`
2. створює клієнт MongoDB
3. очікує готовності бази даних
4. відкриває базу та колекцію `items`
5. запускає HTTP-сервер

Для production і для тестів використовуються різні Dockerfile:

- `Dockerfile` — для запуску застосунку
- `Dockerfile.test` — для запуску тестів

## Змінні середовища

| Змінна | Значення за замовчуванням | Опис |
|---|---|---|
| `APP_HOST` | `0.0.0.0` | Хост, на якому запускається сервер |
| `APP_PORT` | `8000` | Порт, на якому працює API |
| `DATABASE_URL` | `mongodb://root:rootpassword@db:27017/app_db?authSource=admin` | Рядок підключення до MongoDB |

Приклад файлу `.env.example`:

```env
APP_HOST=0.0.0.0
APP_PORT=8000
DATABASE_URL=mongodb://root:rootpassword@db:27017/app_db?authSource=admin
```

Для локального запуску поза Docker зазвичай зручніше використовувати:

```env
DATABASE_URL=mongodb://root:rootpassword@localhost:27017/app_db?authSource=admin
```

## Локальний запуск

### Передумови

Потрібно мати:

- `Node.js 22+`
- `npm`
- запущену `MongoDB`, якщо планується повний локальний запуск із реальною БД

### Кроки запуску

1. Встановити залежності:

```bash
npm install
```

2. Створити `.env` на основі прикладу:

PowerShell:

```powershell
Copy-Item .env.example .env
```

Bash:

```bash
cp .env.example .env
```

3. Якщо MongoDB запущена локально, за потреби змінити `DATABASE_URL` у `.env`.

4. Запустити застосунок:

```bash
npm run dev
```

### Після запуску

Сервіс буде доступний за адресами:

- `http://localhost:8000`
- `http://localhost:8000/docs`
- `http://localhost:8000/openapi.json`

## Запуск через Docker Compose

Docker Compose — це основний рекомендований спосіб запуску цього проєкту, тому що він одразу піднімає і застосунок, і MongoDB.

### Повний запуск

```bash
docker compose up --build
```

### Запуск у фоновому режимі

```bash
docker compose up -d --build app db
```

### Зупинка

```bash
docker compose down
```

### Перевірка запущених контейнерів

```bash
docker compose ps
```

### Що саме піднімається

- `app` — Node.js/Express API
- `db` — MongoDB
- `tests` — окремий тестовий контейнер, який запускається за потреби

## Тести

У проєкті є два рівні тестування.

### 1. Базові API-тести

Файл: `tests/app.test.js`

Ці тести перевіряють:

- `GET /health`
- створення нового елемента
- отримання списку елементів
- коректну відповідь `404` для неіснуючого елемента

Для цих тестів використовується `inMemoryItemRepository`, тому вони не залежать від реальної MongoDB.

### 2. Інтеграційний тест з MongoDB

Файл: `tests/mongodb.integration.test.js`

Цей тест перевіряє:

- реальне підключення до MongoDB
- запис елемента в БД
- читання елемента зі списку
- отримання елемента за `id`

### Запуск тестів локально

```bash
npm test
```

Важливо:

- якщо `DATABASE_URL` не задано або MongoDB недоступна, інтеграційний тест буде `skipped`
- це нормальна поведінка для швидкого локального запуску

### Повний прогін тестів локально з MongoDB

1. Підняти базу:

```powershell
docker compose up -d db
```

2. Задати змінну:

```powershell
$env:DATABASE_URL="mongodb://root:rootpassword@localhost:27017/app_db?authSource=admin"
```

3. Запустити:

```powershell
npm test
```

### Повний прогін тестів через Docker

```bash
docker compose run --build --rm tests
```

Це найточніший спосіб перевірки, тому що:

- піднімається реальна MongoDB
- запускаються unit/API-тести
- запускається інтеграційний тест

### Перевірка стилю коду

```bash
npm run lint
```

## Документація API

У проєкті налаштовано Swagger UI.

Доступні маршрути:

- `GET /docs` — браузерна документація
- `GET /openapi.json` — OpenAPI JSON

Це дозволяє тестувати API без написання окремого frontend-а.

## Опис endpoint-ів

### `GET /health`

Перевіряє, що сервіс працює.

Приклад відповіді:

```json
{
  "status": "ok"
}
```

### `GET /api/v1/items`

Повертає список усіх елементів.

Приклад:

```json
[
  {
    "id": "681b8e1234567890abcdef12",
    "name": "Docker",
    "description": "Containerized service"
  }
]
```

### `GET /api/v1/items/{itemId}`

Повертає один елемент за `id`.

Якщо елемент не знайдено:

```json
{
  "detail": "Item not found"
}
```

### `POST /api/v1/items`

Створює новий елемент.

Приклад тіла запиту:

```json
{
  "name": "Docker",
  "description": "Containerized service"
}
```

Приклад відповіді:

```json
{
  "id": "681b8e1234567890abcdef12",
  "name": "Docker",
  "description": "Containerized service"
}
```

## Приклади запитів

### PowerShell

```powershell
Invoke-RestMethod -Uri http://localhost:8000/health

Invoke-RestMethod `
  -Uri http://localhost:8000/api/v1/items `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"name":"Docker","description":"Containerized service"}'

Invoke-RestMethod -Uri http://localhost:8000/api/v1/items
```

### curl

```bash
curl http://localhost:8000/health

curl -X POST http://localhost:8000/api/v1/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Docker","description":"Containerized service"}'

curl http://localhost:8000/api/v1/items
```

## CI/CD

У проєкті використовується GitHub Actions.

Файл конфігурації:

- `.github/workflows/ci.yml`

Посилання на workflow:

- `https://github.com/ValeraKozak/l6_ref/actions/workflows/ci.yml`

### Що виконує pipeline

1. Завантажує код репозиторію
2. Встановлює Node.js 22
3. Виконує `npm ci`
4. Запускає `npm run lint`
5. Запускає `npm test`
6. Перевіряє збірку Docker-образу

### Що піднімається в CI

У CI додатково запускається MongoDB як service container, тому integration test проходить у реальному середовищі.

## Типові проблеми

### `npm test` показує `1 skipped`

Це означає, що integration test з MongoDB не був запущений, бо:

- не задано `DATABASE_URL`
- або MongoDB недоступна

Це нормальна поведінка для локального швидкого запуску.

### Застосунок не підключається до MongoDB локально

Перевір:

- чи запущено MongoDB
- чи правильний `DATABASE_URL`
- чи використовуєш `localhost`, якщо база запущена локально, а не в Docker network

### Потрібно швидко перевірити весь проєкт

Рекомендований мінімальний набір команд:

```bash
npm run lint
npm test
docker compose run --build --rm tests
docker compose up -d --build app db
```


