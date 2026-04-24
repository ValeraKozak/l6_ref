from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session

from app.database import Base, get_db, get_engine, wait_for_database
from app.models import Item
from app.schemas import ItemCreate, ItemRead


@asynccontextmanager
async def lifespan(_: FastAPI):
    wait_for_database()
    Base.metadata.create_all(bind=get_engine())
    yield


app = FastAPI(
    title="Lab 6 DevOps Demo",
    description="Simple inventory API prepared for Docker and CI/CD.",
    version="1.0.0",
    lifespan=lifespan,
)

DbSession = Annotated[Session, Depends(get_db)]


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/v1/items", response_model=list[ItemRead])
def list_items(db: DbSession) -> list[Item]:
    return db.query(Item).order_by(Item.id).all()


@app.get("/api/v1/items/{item_id}", response_model=ItemRead)
def get_item(item_id: int, db: DbSession) -> Item:
    item = db.get(Item, item_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )
    return item


@app.post("/api/v1/items", response_model=ItemRead, status_code=status.HTTP_201_CREATED)
def create_item(payload: ItemCreate, db: DbSession) -> Item:
    item = Item(name=payload.name, description=payload.description)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
