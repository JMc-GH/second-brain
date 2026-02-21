import httpx

from app.core.config import get_settings


async def generate_answer(question: str, context: str) -> str:
    settings = get_settings()
    prompt = (
        "You are an assistant for a second-brain app. "
        "Use the provided context to answer the user question accurately.\n\n"
        f"Context:\n{context}\n\nQuestion:\n{question}\n"
    )

    payload = {"model": settings.ollama_model, "prompt": prompt, "stream": False}

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(f"{settings.ollama_url}/api/generate", json=payload)
        response.raise_for_status()
        body = response.json()
        return body.get("response", "No response from Ollama.")
