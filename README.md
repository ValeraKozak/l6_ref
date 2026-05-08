# Лабораторна робота 6: DevOps, CI/CD, Docker

[![CI](https://github.com/ValeraKozak/l6_ref/actions/workflows/ci.yml/badge.svg)](https://github.com/ValeraKozak/l6_ref/actions/workflows/ci.yml)

Це версія лабораторної роботи на JavaScript. Застосунок написаний на Node.js з використанням Express, працює з MongoDB, запускається через Docker і перевіряється через GitHub Actions.

Репозиторій: `https://github.com/ValeraKozak/l6_ref`

## Що є в проєкті

- `src/` - код застосунку
- `tests/` - тести
- `Dockerfile` - образ для запуску сервісу
- `Dockerfile.test` - образ для запуску тестів
- `docker-compose.yaml` - запуск застосунку, бази даних і тестового контейнера
- `.github/workflows/ci.yml` - CI-конвеєр
- `REPORT.md` - короткий звіт

## Основні endpoint-и

- `GET /health` - перевірка, чи сервіс працює
- `GET /api/v1/items` - список елементів
- `GET /api/v1/items/{itemId}` - один елемент за id
- `POST /api/v1/items` - створення нового елемента
- `GET /docs` - браузерна документація API
- `GET /openapi.json` - OpenAPI-опис API

Приклад JSON для `POST /api/v1/items`:

```json
{
  "name": "Docker",
  "description": "Containerized service"
}
```

## Змінні середовища

| Змінна | Для чого потрібна | Приклад |
|---|---|---|
| `APP_HOST` | Хост, на якому запускається сервер | `0.0.0.0` |
| `APP_PORT` | Порт застосунку | `8000` |
| `DATABASE_URL` | Рядок підключення до MongoDB | `mongodb://root:rootpassword@db:27017/app_db?authSource=admin` |

Можна взяти `.env.example`, скопіювати його в `.env` і змінити значення під себе.

## Локальний запуск

### PowerShell

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

### Bash

```bash
npm install
cp .env.example .env
npm run dev
```

Після запуску сервіс буде доступний за адресами:

- `http://localhost:8000`
- `http://localhost:8000/docs`

## Запуск через Docker

Щоб підняти застосунок разом із MongoDB:

```bash
docker compose up --build
```

Щоб окремо прогнати тести:

```bash
docker compose run --build --rm tests
```

Щоб зупинити середовище:

```bash
docker compose down
```

## Перевірка коду і тестів

Локально:

```bash
npm run lint
npm test
```

Що саме перевіряється:

- unit/API-тести для логіки endpoint-ів
- інтеграційний тест із реальною MongoDB, якщо задано `DATABASE_URL`

Через Docker:

```bash
docker compose run --rm tests
```

Очікувано:

- `npm run lint` завершується без помилок
- `npm test` проходить успішно
- Docker-образ збирається без помилок

## Як перевірити результат

1. Виконати `docker compose up --build`.
2. Відкрити `http://localhost:8000/docs`.
3. Перевірити `GET /health`.
4. Створити елемент через `POST /api/v1/items`.
5. Перевірити список через `GET /api/v1/items`.

Приклад для PowerShell:

```powershell
Invoke-RestMethod -Uri http://localhost:8000/health
Invoke-RestMethod -Uri http://localhost:8000/api/v1/items -Method Post -ContentType "application/json" -Body '{"name":"Docker","description":"Containerized service"}'
Invoke-RestMethod -Uri http://localhost:8000/api/v1/items
```

Приклад для curl:

```bash
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/v1/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Docker","description":"Containerized service"}'
curl http://localhost:8000/api/v1/items
```

## CI/CD

У проєкті використовується GitHub Actions.

Workflow:

- `.github/workflows/ci.yml`
- `https://github.com/ValeraKozak/l6_ref/actions/workflows/ci.yml`

Що робить pipeline:

1. Встановлює npm-залежності
2. Запускає `eslint`
3. Запускає unit- та MongoDB integration тести
4. Збирає Docker-образ

## Що додати до фінальної здачі

- скріншот запущених контейнерів після `docker compose up --build`
- скріншот сторінки `http://localhost:8000/docs`
- скріншот успішного `GET /health` або `POST /api/v1/items`
- скріншот зеленого GitHub Actions workflow
- за можливості короткий GIF або відео демонстрації
