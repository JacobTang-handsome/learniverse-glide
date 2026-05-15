import json
import os
from collections.abc import AsyncGenerator

from google import genai
from google.genai import types
from sqlalchemy.orm import Session

from app.schemas.chat import ChatMessage

# TODO: Replace these imports with the project's concrete model paths if they differ.
from app.models.mistake import Mistake
from app.models.vocabulary import Vocabulary


EXTRACTION_PROMPT = """
You are a Spanish learning analysis assistant.

Given a recent tutor conversation, extract learning signals for the learner.
Return JSON with exactly two keys:
- "vocabulary": an array of Spanish words or short phrases worth saving for later review
- "grammar_mistakes": an array of short grammar mistake labels or descriptions

Rules:
- Focus on concrete vocabulary introduced, practiced, corrected, or repeated.
- Focus on the learner's likely grammar mistakes or weak grammar patterns.
- Avoid duplicates.
- Keep entries concise.
- Do not include markdown.
- Return JSON only.

Conversation:
{full_chat_context}
""".strip()


def _build_chat_contents(messages: list[ChatMessage]) -> list[types.Content]:
    contents: list[types.Content] = []
    for message in messages:
        role = "model" if message.role == "assistant" else "user"
        contents.append(
            types.Content(
                role=role,
                parts=[types.Part.from_text(text=message.content)],
            )
        )
    return contents


async def stream_tutor_response(
    messages: list[ChatMessage],
) -> AsyncGenerator[str, None]:
    api_key = os.getenv("GOOGLE_API_KEY")
    model_name = os.getenv("CHAT_MODEL", "gemini-2.5-flash")

    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured.")

    client = genai.Client(api_key=api_key)

    stream = await client.aio.models.generate_content_stream(
        model=model_name,
        contents=_build_chat_contents(messages),
        config=types.GenerateContentConfig(
            temperature=0.7,
            system_instruction=(
                "You are a warm Spanish tutor for A1-B1 learners. "
                "Respond naturally, keep the conversation going, and correct gently when helpful."
            ),
        ),
    )

    async for chunk in stream:
        text = getattr(chunk, "text", None)
        if text:
            yield f"0:{json.dumps(text)}\n"


async def extract_learning_data(
    user_id: int,
    full_chat_context: str,
    db: Session,
) -> None:
    api_key = os.getenv("GOOGLE_API_KEY")
    model_name = os.getenv("EXTRACTION_MODEL", "gemini-2.5-flash")

    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured.")

    client = genai.Client(api_key=api_key)

    try:
        response = await client.aio.models.generate_content(
            model=model_name,
            contents=EXTRACTION_PROMPT.format(full_chat_context=full_chat_context),
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )

        payload = json.loads(response.text or "{}")
        vocabulary_items = payload.get("vocabulary", [])
        grammar_mistakes = payload.get("grammar_mistakes", [])

        for word in vocabulary_items:
            if isinstance(word, str) and word.strip():
                db.add(
                    Vocabulary(
                        user_id=user_id,
                        word=word.strip(),
                    )
                )

        for rule_name in grammar_mistakes:
            if isinstance(rule_name, str) and rule_name.strip():
                db.add(
                    Mistake(
                        user_id=user_id,
                        rule_name=rule_name.strip(),
                    )
                )

        db.commit()
    except Exception:
        db.rollback()
        raise
