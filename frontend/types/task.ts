export interface Flashcard {
  word: string;
  example: string;
}

export interface DailyPlan {
  daily_greeting: string;
  flashcards: Flashcard[];
  reading_text: string;
}
