from pydantic import BaseModel, ConfigDict, Field


class ItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=1, max_length=255)


class ItemRead(ItemCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)
