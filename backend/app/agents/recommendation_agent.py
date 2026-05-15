import os
from pathlib import Path

from google import genai
from google.genai import types
from pydantic import ValidationError

from app.schemas.task import DailyTaskResponse


PROMPT_PATH = (
    Path(__file__).resolve().parent.parent
    / "prompts"
    / "recommendation"
    / "daily_task_prompt.txt"
)


def _format_list(items: list[str]) -> str:
    if not items:
        return "None provided."
    return "\n".join(f"- {item}" for item in items)


async def generate_daily_plan(
    user_id: int,
    user_level: str,
    vocab_list: list[str],
    mistakes_list: list[str],
) -> DailyTaskResponse:
    del user_id

    prompt_template = PROMPT_PATH.read_text(encoding="utf-8")
    prompt = prompt_template.format(
        user_level=user_level,
        vocab_review=_format_list(vocab_list),
        grammar_mistakes=_format_list(mistakes_list),
    )

    api_key = os.getenv("GOOGLE_API_KEY")
    model_name = os.getenv("DAILY_TASK_MODEL", "gemini-2.5-flash")

    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured.")

    client = genai.Client(api_key=api_key)

    try:
        response = await client.aio.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=DailyTaskResponse,
                temperature=0.7,
            ),
        )

        parsed_response = response.parsed
        if isinstance(parsed_response, DailyTaskResponse):
            return parsed_response

        if parsed_response is not None:
            return DailyTaskResponse.model_validate(parsed_response)

        if response.text:
            return DailyTaskResponse.model_validate_json(response.text)

        raise ValueError("The LLM returned an empty response.")
    except ValidationError as exc:
        raise ValueError("Failed to validate daily task response from LLM.") from exc
    except TimeoutError as exc:
        raise RuntimeError("Timed out while generating the daily task plan.") from exc
    except Exception as exc:
        raise RuntimeError("Failed to generate the daily task plan.") from exc
