# Second Brain Scaffold

Scaffolded full-stack app for document intelligence powered by Ollama.

## Stack

- **Backend**: FastAPI, Pydantic, SQLAlchemy, Alembic, SQLite
- **Frontend**: React, Vite, Tailwind CSS
- **LLM runtime**: Ollama (`/api/generate`)
- **Sources**: file uploads + RSS news ingestion

## Quick start (Docker)

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`  
Backend API docs: `http://localhost:8000/docs`

## Local backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

## Local frontend setup

```bash
cd frontend
npm install
npm run dev
```

## API surface

- `POST /api/documents/upload`: Upload plain-text documents.
- `GET /api/documents`: List all indexed records.
- `POST /api/news/ingest`: Pull configured RSS feed entries into the DB.
- `POST /api/chat`: Ask questions against recent document/news context using Ollama.

## Notes

- Uploaded files are persisted to `./uploads`.
- This is intentionally a scaffold: add chunking/vector search and auth for production.
