import feedparser
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.services.document_service import create_document


def fetch_headlines(feed_urls: list[str], max_entries_per_feed: int = 5) -> list[dict[str, str]]:
    headlines: list[dict[str, str]] = []

    for feed_url in feed_urls:
        parsed = feedparser.parse(feed_url)
        source = parsed.feed.get("title", feed_url)
        for entry in parsed.entries[:max_entries_per_feed]:
            headlines.append(
                {
                    "title": entry.get("title", "Untitled"),
                    "link": entry.get("link", feed_url),
                    "source": source,
                }
            )

    return headlines


def ingest_news_feeds(db: Session) -> int:
    settings = get_settings()
    ingested_count = 0

    for headline in fetch_headlines(settings.default_news_feeds):
        title = headline["title"]
        link = headline["link"]
        source = headline["source"]
        content = f"Title: {title}\nURL: {link}\nSource: {source}"
        create_document(
            db,
            filename=f"news-{title[:60]}",
            content=content,
            source_type="news",
            source_url=link,
        )
        ingested_count += 1

    return ingested_count


def fetch_uk_headlines(max_entries_per_feed: int = 5) -> list[dict[str, str]]:
    settings = get_settings()
    return fetch_headlines(settings.uk_news_feeds, max_entries_per_feed=max_entries_per_feed)
