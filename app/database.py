import time
from functools import lru_cache
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from app.config import settings

Base = declarative_base()


def _sqlite_connect_args(database_url: str) -> dict:
    if database_url.startswith("sqlite"):
        return {"check_same_thread": False}
    return {}


@lru_cache(maxsize=1)
def get_engine():
    return create_engine(
        settings.database_url,
        future=True,
        pool_pre_ping=True,
        connect_args=_sqlite_connect_args(settings.database_url),
    )


@lru_cache(maxsize=1)
def get_session_factory():
    return sessionmaker(bind=get_engine(), autoflush=False, autocommit=False, future=True)


def get_db() -> Generator[Session, None, None]:
    session = get_session_factory()()
    try:
        yield session
    finally:
        session.close()


def wait_for_database(max_attempts: int = 10, delay_seconds: int = 2) -> None:
    engine = get_engine()
    for attempt in range(1, max_attempts + 1):
        try:
            with engine.connect():
                return
        except OperationalError:
            if attempt == max_attempts:
                raise
            time.sleep(delay_seconds)
