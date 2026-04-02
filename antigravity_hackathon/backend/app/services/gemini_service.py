import json
import re
import ast
from typing import Any

import google.generativeai as genai
from pydantic import BaseModel, Field, ValidationError

from app.config import get_settings


class HomeworkOut(BaseModel):
    description: str = ""
    tasks: list[str] = Field(default_factory=list)


class ExerciseOut(BaseModel):
    question: str = ""
    type: str = "open_ended"
    options: list[str] = Field(default_factory=list)
    answer: str = ""


class ExamQuestionOut(BaseModel):
    question: str = ""
    type: str = "open_ended"
    options: list[str] = Field(default_factory=list)
    answer: str = ""
    difficulty: str = "medium"


class NextLessonPlanOut(BaseModel):
    suggested_topic: str = ""
    learning_objectives: list[str] = Field(default_factory=list)
    recommended_activities: list[str] = Field(default_factory=list)


class GeminiMaterialsOut(BaseModel):
    summary: str = ""
    key_points: list[str] = Field(default_factory=list)
    homework: HomeworkOut = Field(default_factory=HomeworkOut)
    exercises: list[ExerciseOut] = Field(default_factory=list)
    exam_questions: list[ExamQuestionOut] = Field(default_factory=list)
    next_lesson_plan: NextLessonPlanOut = Field(default_factory=NextLessonPlanOut)
    subject_detected: str = ""
    grade_level_detected: str = ""
    quality_warning: bool | None = False


OUTPUT_SCHEMA_BLOCK = r"""{
  "summary": "string — concise lesson summary in Mongolian (max 300 words)",
  "key_points": ["string", "..."],
  "homework": {
    "description": "string — homework instructions in Mongolian",
    "tasks": ["string", "..."]
  },
  "exercises": [
    {
      "question": "string",
      "type": "multiple_choice | open_ended | calculation",
      "options": ["A)...", "B)...", "C)...", "D)..."],
      "answer": "string"
    }
  ],
  "exam_questions": [
    {
      "question": "string",
      "type": "multiple_choice | open_ended",
      "options": ["A)...", "B)...", "C)...", "D)..."],
      "answer": "string",
      "difficulty": "easy | medium | hard"
    }
  ],
  "next_lesson_plan": {
    "suggested_topic": "string",
    "learning_objectives": ["string", "..."],
    "recommended_activities": ["string", "..."]
  },
  "subject_detected": "string",
  "grade_level_detected": "string",
  "quality_warning": false
}"""


def build_prompt(transcript: str, metadata: dict[str, Any]) -> str:
    meta_str = json.dumps(metadata, ensure_ascii=False) if metadata else "{}"
    return f"""You are an expert Mongolian K-12 curriculum specialist and pedagogy assistant.

A teacher has just finished teaching a lesson. Below is the full transcript 
of their lesson, captured via voice recording and transcribed from Mongolian audio.

LESSON METADATA (may be empty if unknown):
{meta_str}

LESSON TRANSCRIPT:
{transcript}

Your task is to generate comprehensive educational support materials based 
strictly on what was taught in this lesson. Do not invent topics not covered 
in the transcript.

Generate a response in the following JSON format. All text content must be 
in Mongolian language. Return ONLY valid JSON, no markdown, no extra text:

{OUTPUT_SCHEMA_BLOCK}

Guidelines:
- summary: Write as if explaining to a student who missed class
- exercises: Exactly 5 exercises total; match difficulty to apparent grade level
- exam_questions: Exactly 10 exam questions; mix: 3 easy, 5 medium, 2 hard
- next_lesson_plan: 3 learning objectives and 3 recommended activities
- next_lesson_plan: Logically continues from what was taught today
- If the transcript is unclear or too short (<50 words), still generate 
  the best possible output but set quality_warning to true
"""


def _strip_code_fences(text: str) -> str:
    t = text.strip()
    if t.startswith("```"):
        t = re.sub(r"^```(?:json)?\s*", "", t)
        t = re.sub(r"\s*```$", "", t)
    return t.strip()


def _extract_json_object(text: str) -> str:
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return text[start : end + 1].strip()
    return text.strip()


def _remove_trailing_commas(text: str) -> str:
    # Handles common LLM JSON issues like {"a":1,}
    return re.sub(r",\s*([}\]])", r"\1", text)


def _loads_lenient(raw: str) -> dict[str, Any]:
    candidate = _remove_trailing_commas(_extract_json_object(_strip_code_fences(raw)))
    try:
        data = json.loads(candidate)
        if isinstance(data, dict):
            return data
    except json.JSONDecodeError:
        pass

    # Fallback for Python-dict-like responses: {'k': 'v', 'ok': True}
    py_candidate = candidate.replace("null", "None").replace("true", "True").replace("false", "False")
    data = ast.literal_eval(py_candidate)
    if not isinstance(data, dict):
        raise ValueError("Gemini response is not a JSON object")
    return data


def _is_gemini_model_unavailable_error(exc: BaseException) -> bool:
    msg = str(exc).lower()
    return (
        "is not found for api version" in msg
        or "is not supported for generatecontent" in msg
        or ("404" in msg and "model" in msg)
        or ("not found" in msg and "models/" in msg)
    )


def parse_and_validate(raw: str) -> GeminiMaterialsOut:
    data = _loads_lenient(raw)
    return GeminiMaterialsOut.model_validate(data)


def generate_materials_from_transcript(transcript: str, metadata: dict[str, Any]) -> GeminiMaterialsOut:
    settings = get_settings()
    if not settings.gemini_api_key:
        raise ValueError("GEMINI_API_KEY тохируулаагүй")

    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(settings.gemini_model)

    base_prompt = build_prompt(transcript, metadata)
    extra = ""
    last_err: Exception | None = None
    for attempt in range(3):
        prompt = base_prompt + extra
        try:
            response = model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.3,
                    "max_output_tokens": 4096,
                    "response_mime_type": "application/json",
                },
            )
            raw = (response.text or "").strip()
            return parse_and_validate(raw)
        except (json.JSONDecodeError, ValidationError, ValueError) as e:
            last_err = e
            extra = (
                "\n\nYour previous response was not valid JSON. "
                "Return ONLY a raw JSON object."
            )
        except Exception as e:
            if _is_gemini_model_unavailable_error(e):
                raise RuntimeError(
                    f"Gemini загвар ашиглах боломжгүй ({settings.gemini_model}). "
                    "Шинэ stable загвар ашиглана уу, жишээ нь .env дээр GEMINI_MODEL=gemini-2.5-flash. "
                    f"Дэлгэрэнгүй: {e}"
                ) from e
            last_err = e
            extra = (
                "\n\nYour previous response was not valid JSON. "
                "Return ONLY a raw JSON object."
            )
    raise RuntimeError(f"Gemini JSON алдаа: {last_err}") from last_err


def materials_to_storage_dict(m: GeminiMaterialsOut) -> dict[str, Any]:
    return json.loads(m.model_dump_json())
