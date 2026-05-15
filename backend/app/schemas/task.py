from pydantic import BaseModel


class FlashcardSchema(BaseModel):
    word: str
    example: str


class DailyTaskResponse(BaseModel):
    daily_greeting: str
    flashcards: list[FlashcardSchema]
    reading_text: str
