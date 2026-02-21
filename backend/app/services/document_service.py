from pathlib import Path

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.document import Document


def save_uploaded_file(upload: UploadFile) -> tuple[str, str]:
    settings = get_settings()
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    destination = upload_dir / upload.filename

    content_bytes = upload.file.read()
    content_text = content_bytes.decode("utf-8", errors="ignore")
    destination.write_bytes(content_bytes)
    return str(destination), content_text


def create_document(db: Session, filename: str, content: str, source_type: str = "upload", source_url: str | None = None) -> Document:
    document = Document(
        filename=filename,
        content=content,
        source_type=source_type,
        source_url=source_url,
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document
