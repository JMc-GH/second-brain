from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=3)
    max_documents: int = Field(default=6, ge=1, le=25)


class ChatResponse(BaseModel):
    answer: str
    context_count: int
