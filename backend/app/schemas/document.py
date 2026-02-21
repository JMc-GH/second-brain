from datetime import datetime

from pydantic import BaseModel


class DocumentOut(BaseModel):
    id: int
    filename: str
    source_type: str
    source_url: str | None
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
