from sqlalchemy import Column, Date, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB

from app.db.base import Base


class DailyTask(Base):
    __tablename__ = "daily_tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    daily_greeting = Column(Text, nullable=False)
    reading_text = Column(Text, nullable=False)
    flashcards = Column(JSONB, nullable=False, default=list)
