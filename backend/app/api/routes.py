from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.document import Document
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.document import DocumentOut
from app.services.document_service import create_document, save_uploaded_file
from app.services.news_service import fetch_uk_headlines, ingest_news_feeds
from app.services.ollama_service import generate_answer

router = APIRouter(prefix="/api")


@router.get("/health")
def healthcheck():
    return {"status": "ok"}


@router.post("/documents/upload", response_model=DocumentOut)
def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing file name")

    _, content = save_uploaded_file(file)
    return create_document(db, filename=file.filename, content=content)


@router.get("/documents", response_model=list[DocumentOut])
def list_documents(db: Session = Depends(get_db)):
    return db.scalars(select(Document).order_by(Document.created_at.desc())).all()


@router.post("/news/ingest")
def ingest_news(db: Session = Depends(get_db)):
    count = ingest_news_feeds(db)
    return {"ingested": count}


@router.get("/news/uk")
def uk_news_headlines(limit_per_feed: int = 5):
    return fetch_uk_headlines(max_entries_per_feed=limit_per_feed)


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    documents = db.scalars(
        select(Document).order_by(Document.created_at.desc()).limit(payload.max_documents)
    ).all()
    if not documents:
        raise HTTPException(status_code=400, detail="No documents indexed yet")

    context = "\n\n---\n\n".join(doc.content[:4000] for doc in documents)
    answer = await generate_answer(payload.question, context)

    return ChatResponse(answer=answer, context_count=len(documents))
