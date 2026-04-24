from pathlib import Path

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app


def build_test_client():
    test_db_path = Path("tests/test.db")
    if test_db_path.exists():
        test_db_path.unlink()

    engine = create_engine(
        f"sqlite:///{test_db_path}",
        connect_args={"check_same_thread": False},
        future=True,
    )
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        session = TestingSessionLocal()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)
    return client, test_db_path


def test_healthcheck():
    client, test_db_path = build_test_client()

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    test_db_path.unlink(missing_ok=True)


def test_create_and_list_items():
    client, test_db_path = build_test_client()

    create_response = client.post(
        "/api/v1/items",
        json={"name": "Docker", "description": "Containerized service"},
    )
    list_response = client.get("/api/v1/items")

    assert create_response.status_code == 201
    assert create_response.json()["id"] == 1
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1
    assert list_response.json()[0]["name"] == "Docker"
    test_db_path.unlink(missing_ok=True)


def test_get_item_returns_404_for_missing_id():
    client, test_db_path = build_test_client()

    response = client.get("/api/v1/items/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Item not found"
    test_db_path.unlink(missing_ok=True)
