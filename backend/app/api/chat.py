from collections.abc import AsyncGenerator

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.agents.tutor_agent import extract_learning_data, stream_tutor_response
from app.db.session import SessionLocal, get_db
from app.schemas.chat import ChatRequest


router = APIRouter(prefix="/chat", tags=["Chat"])


async def _run_extraction_task(user_id: int, full_chat_context: str) -> None:
    db = SessionLocal()
    try:
        await extract_learning_data(
            user_id=user_id,
            full_chat_context=full_chat_context,
            db=db,
        )
    finally:
        db.close()


@router.post("/")
async def create_chat_completion(
    request: ChatRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> StreamingResponse:
    del db

    async def event_stream() -> AsyncGenerator[str, None]:
        raw_response_chunks: list[str] = []

        try:
            async for chunk in stream_tutor_response(request.messages):
                yield chunk
                if chunk.startswith("0:"):
                    raw_response_chunks.append(chunk[2:].strip())
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to stream tutor response.",
            ) from exc
        finally:
            assistant_response = "".join(
                json.loads(chunk) for chunk in raw_response_chunks
            ).strip()
            history_parts = [
                f"{message.role}: {message.content}" for message in request.messages
            ]
            if assistant_response:
                history_parts.append(f"assistant: {assistant_response}")

            full_chat_context = "\n".join(history_parts).strip()
            if full_chat_context:
                background_tasks.add_task(
                    _run_extraction_task,
                    request.user_id,
                    full_chat_context,
                )

    return StreamingResponse(
        event_stream(),
        media_type="text/plain; charset=utf-8",
    )
