from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

from app.agents.recommendation_agent import generate_daily_plan
from app.db.session import get_db
from app.models.task import DailyTask
from app.schemas.task import DailyTaskResponse

# TODO: Replace these imports with the project's concrete model paths if they differ.
from app.models.mistake import Mistake
from app.models.user import User
from app.models.vocabulary import Vocabulary


router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("/daily", response_model=DailyTaskResponse)
async def get_daily_task(
    user_id: int = Query(..., gt=0),
    db: Session = Depends(get_db),
) -> DailyTaskResponse:
    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    # TODO: Adjust this attribute path if level is stored on a related profile model.
    user_level = getattr(user, "target_level", None) or getattr(user, "level", None)
    if not user_level:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User language level is not configured.",
        )

    today = date.today()

    vocab_stmt = (
        select(Vocabulary.word)
        .where(Vocabulary.user_id == user_id)
        .where(Vocabulary.next_review_date <= today)
        .order_by(Vocabulary.next_review_date.asc())
        .limit(10)
    )
    vocab_list = list(db.execute(vocab_stmt).scalars().all())

    mistakes_stmt = (
        select(Mistake.rule_name, func.count(Mistake.id).label("mistake_count"))
        .where(Mistake.user_id == user_id)
        .group_by(Mistake.rule_name)
        .order_by(desc("mistake_count"))
        .limit(2)
    )
    mistakes_rows = db.execute(mistakes_stmt).all()
    mistakes_list = [row.rule_name for row in mistakes_rows if row.rule_name]

    # End the implicit read transaction before awaiting the external LLM call.
    db.rollback()

    try:
        daily_plan = await generate_daily_plan(
            user_id=user_id,
            user_level=user_level,
            vocab_list=vocab_list,
            mistakes_list=mistakes_list,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to generate daily task plan.",
        ) from exc

    daily_task = DailyTask(
        user_id=user_id,
        date=today,
        daily_greeting=daily_plan.daily_greeting,
        reading_text=daily_plan.reading_text,
        flashcards=[flashcard.model_dump() for flashcard in daily_plan.flashcards],
    )

    try:
        db.add(daily_task)
        db.commit()
        db.refresh(daily_task)
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save daily task plan.",
        ) from exc

    return daily_plan
