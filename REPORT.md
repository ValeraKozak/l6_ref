# Laboratory Work 6 Report

## Goal

Automate build, test, and delivery steps for a small web service using Docker and CI/CD tools.

## Completed Work

- Implemented a sample FastAPI service with PostgreSQL integration.
- Added Docker support through `Dockerfile` and `Dockerfile.test`.
- Added `docker-compose.yaml` for `app + db + tests`.
- Configured CI in GitHub Actions with linting, automated tests, and Docker build.
- Updated `README.md` with run instructions, environment variables, API endpoints, and verification steps.

## Main Steps

1. Created a REST API with endpoints for health checks and item management.
2. Added SQLAlchemy-based database integration.
3. Created automated tests with `pytest`.
4. Containerized the service and test environment with Docker.
5. Added a CI workflow for code quality and build verification.

## Architecture

```text
Developer -> GitHub -> GitHub Actions -> lint + tests + docker build
                                 |
                                 v
                           Docker Compose
                                 |
                +----------------+----------------+
                |                                 |
                v                                 v
           FastAPI App --------------------> PostgreSQL
```

## Screenshots To Add Before Submission

- Running `docker compose up`
- Swagger UI opened in browser
- Successful GitHub Actions pipeline
- Passing test output

## Demo Materials

Recommended demo:

- Short GIF or video showing `docker compose up --build`
- API test in Swagger UI or Postman
- Successful CI run in GitHub Actions
