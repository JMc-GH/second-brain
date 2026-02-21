import feedparser
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.services.document_service import create_document


def ingest_news_feeds(db: Session) -> int:
    settings = get_settings()
    ingested_count = 0

    for feed_url in settings.default_news_feeds:
        parsed = feedparser.parse(feed_url)
        for entry in parsed.entries[:5]:
            title = entry.get("title", "Untitled")
            summary = entry.get("summary", "")
            link = entry.get("link", feed_url)
            content = f"Title: {title}\nURL: {link}\nSummary: {summary}"
            create_document(
                db,
                filename=f"news-{title[:60]}",
                content=content,
                source_type="news",
                source_url=link,
            )
            ingested_count += 1

    return ingested_count
