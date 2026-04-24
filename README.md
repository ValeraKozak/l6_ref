# Лабораторна робота 6: DevOps, CI/CD, Docker

[![CI](https://github.com/ValeraKozak/l6_ref/actions/workflows/ci.yml/badge.svg)](https://github.com/ValeraKozak/l6_ref/actions/workflows/ci.yml)

Це невеликий навчальний проєкт для лабораторної роботи №6. У репозиторії реалізовано простий REST API на FastAPI, який працює з PostgreSQL. Для запуску використовується Docker, а для автоматичної перевірки коду та тестів налаштовано GitHub Actions.

Репозиторій: `https://github.com/ValeraKozak/l6_ref`

## Що є в проєкті

- `app/` - основний код застосунку
- `tests/` - тести
- `Dockerfile` - образ для запуску застосунку
- `Dockerfile.test` - образ для запуску тестів
- `docker-compose.yaml` - запуск застосунку, бази даних і тестового контейнера
- `.github/workflows/ci.yml` - конфігурація CI
- `REPORT.md` - короткий звіт по виконаній роботі

## Основні endpoint-и

- `GET /health` - перевірка, чи сервіс працює
- `GET /api/v1/items` - отримати список елементів
- `GET /api/v1/items/{item_id}` - отримати один елемент за id
- `POST /api/v1/items` - створити новий елемент

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
| `APP_HOST` | Хост, на якому запускається Uvicorn | `0.0.0.0` |
| `APP_PORT` | Порт, на якому працює застосунок | `8000` |
| `DATABASE_URL` | Рядок підключення до бази даних | `postgresql+psycopg://app_user:app_password@db:5432/app_db` |

Можна взяти `.env.example`, скопіювати його в `.env` і за потреби змінити значення під себе.

## Локальний запуск

### Варіант для PowerShell

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
Copy-Item .env.example .env
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Варіант для Bash

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Якщо не хочеться піднімати PostgreSQL локально, можна для швидкої перевірки використати SQLite:

```env
DATABASE_URL=sqlite:///./app.db
```

Після запуску можна відкрити:

- `http://localhost:8000`
- `http://localhost:8000/docs`

## Запуск через Docker

Щоб підняти застосунок разом із PostgreSQL:

```bash
docker compose up --build
```

Щоб окремо прогнати тести в контейнері:

```bash
docker compose run --build --rm tests
```

Щоб зупинити все середовище:

```bash
docker compose down
```

## Перевірка коду і тестів

Локально:

```bash
flake8 app tests
pytest -v
```

Через Docker:

```bash
docker compose run --rm tests
```

Очікувано:

- `flake8` не повинен показувати помилок
- `pytest` має пройти успішно
- Docker-образ має зібратися без проблем

## Як перевірити, що все працює

1. Виконати `docker compose up --build`.
2. Відкрити `http://localhost:8000/docs`.
3. Викликати `GET /health`.
4. Створити елемент через `POST /api/v1/items`.
5. Перевірити список через `GET /api/v1/items`.

Для перевірки можна використати Swagger UI або Postman.

## CI/CD

У проєкті використовується GitHub Actions.

Файл конфігурації:

- `.github/workflows/ci.yml`

Посилання:

- `https://github.com/ValeraKozak/l6_ref/actions/workflows/ci.yml`

Що робить workflow:

1. Встановлює залежності
2. Запускає `flake8`
3. Запускає `pytest`
4. Збирає Docker-образ

## Приклади запитів

### PowerShell

```powershell
Invoke-RestMethod -Uri http://localhost:8000/health
Invoke-RestMethod -Uri http://localhost:8000/api/v1/items -Method Post -ContentType "application/json" -Body '{"name":"Docker","description":"Containerized service"}'
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
