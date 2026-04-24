# Lab 6: DevOps, CI/CD, Docker

[![CI](https://github.com/ValeraKozak/l6_ref/actions/workflows/ci.yml/badge.svg)](https://github.com/ValeraKozak/l6_ref/actions/workflows/ci.yml)

Demonstration project for laboratory work 6. The repository contains a small REST API built with FastAPI, connected to PostgreSQL, containerized with Docker, and prepared for CI/CD with GitHub Actions.

Repository: `https://github.com/ValeraKozak/l6_ref`

## Project Structure

- `app/` - API source code
- `tests/` - unit and API tests
- `Dockerfile` - application image
- `Dockerfile.test` - separate test image
- `docker-compose.yaml` - multi-container launch for app, database, and tests
- `.github/workflows/ci.yml` - CI pipeline
- `REPORT.md` - short final report

## Features

- `GET /health` - health check
- `GET /api/v1/items` - list all items
- `GET /api/v1/items/{item_id}` - get one item
- `POST /api/v1/items` - create a new item

Example request body for `POST /api/v1/items`:

```json
{
  "name": "Docker",
  "description": "Containerized service"
}
```

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `APP_HOST` | Host used by Uvicorn in the container or local run | `0.0.0.0` |
| `APP_PORT` | Port used by Uvicorn in the container or local run | `8000` |
| `DATABASE_URL` | Full SQLAlchemy connection string | `postgresql+psycopg://app_user:app_password@db:5432/app_db` |

Copy `.env.example` to `.env` and update values if needed. `APP_HOST` and `APP_PORT` are now used directly by the container start command.

## Run Locally Without Docker

Prerequisites:

- Python 3.12+
- PostgreSQL 16+ or SQLite for a quick local demo

PowerShell:

```bash
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
Copy-Item .env.example .env
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Bash:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

For a simple local run without PostgreSQL, set:

```env
DATABASE_URL=sqlite:///./app.db
```

The API will be available at:

- `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`

## Run With Docker Compose

Build and start the application with PostgreSQL:

```bash
docker compose up --build
```

Run tests in a separate container:

```bash
docker compose run --build --rm tests
```

Stop the environment:

```bash
docker compose down
```

## Tests and Quality Checks

Local commands:

```bash
flake8 app tests
pytest -v
```

Docker-based test command:

```bash
docker compose run --rm tests
```

Expected result:

- `flake8` finishes without style errors
- `pytest` reports passing tests
- Docker image builds successfully

## How To Verify The Result

1. Start the stack with `docker compose up --build`.
2. Open `http://localhost:8000/docs`.
3. Call `GET /health` and confirm response `{"status":"ok"}`.
4. Use `POST /api/v1/items` to create an item.
5. Use `GET /api/v1/items` to verify the item is stored in PostgreSQL.

You can also test the API in Postman using the same endpoints.

## CI/CD Pipeline

GitHub Actions workflow file: `.github/workflows/ci.yml`

Workflow URL:

- `https://github.com/ValeraKozak/l6_ref/actions/workflows/ci.yml`

Pipeline stages:

1. Install dependencies
2. Run `flake8`
3. Run `pytest`
4. Build Docker image

## Example Requests

PowerShell:

```powershell
Invoke-RestMethod -Uri http://localhost:8000/health
Invoke-RestMethod -Uri http://localhost:8000/api/v1/items -Method Post -ContentType "application/json" -Body '{"name":"Docker","description":"Containerized service"}'
Invoke-RestMethod -Uri http://localhost:8000/api/v1/items
```

curl:

```bash
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/v1/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Docker","description":"Containerized service"}'
curl http://localhost:8000/api/v1/items
```
