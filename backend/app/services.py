"""
Translation service module
"""
import asyncio
import json
import logging
import re
from typing import Optional

import google.generativeai as genai
import httpx

from app.config import settings
from app.models import SubtitleCue, TranslatedCue

logger = logging.getLogger(__name__)


class TranslationService:
    """Service for handling text translation requests via Chipp AI"""

    def __init__(self):
        self.api_key = settings.api_key
        self.base_url = settings.chipp_base_url
        self.model = settings.chipp_model
        self.timeout = 30.0

        if not self.api_key:
            raise ValueError("API key is required but not provided")

    async def translate(
        self,
        text: str,
        source_language: str = "English",
        target_language: str = "Telugu",
    ) -> tuple[bool, Optional[str], Optional[str]]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        prompt = f"""Translate the following text from {source_language} to {target_language}.
        Only provide the translation, no explanations or additional text.

        Text to translate: {text}"""

        data = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "stream": False,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(self.base_url, headers=headers, json=data)

                if response.status_code == 200:
                    result = response.json()
                    if "choices" in result and len(result["choices"]) > 0:
                        translation = (
                            result["choices"][0]
                            .get("message", {})
                            .get("content", "")
                            .strip()
                        )
                        logger.info(f"Translation successful: {source_language} -> {target_language}")
                        return True, translation, None
                    else:
                        error_msg = f"No translation in response: {result}"
                        logger.error(error_msg)
                        return False, None, error_msg
                else:
                    error_msg = f"API call failed with status {response.status_code}: {response.text}"
                    logger.error(error_msg)
                    return False, None, error_msg

        except httpx.TimeoutException:
            error_msg = "Translation request timed out"
            logger.error(error_msg)
            return False, None, error_msg
        except httpx.RequestError as e:
            error_msg = f"Request error: {str(e)}"
            logger.error(error_msg)
            return False, None, error_msg
        except Exception as e:
            error_msg = f"Unexpected error: {str(e)}"
            logger.error(error_msg)
            return False, None, error_msg


class SubtitleTranslationService:
    """Service for translating subtitle cues via Google Gemini API"""

    MODEL = "gemini-2.5-flash-lite"
    MAX_RETRIES = 3

    def __init__(self):
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY is required but not provided")
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(self.MODEL)

    async def translate_subtitles(
        self,
        cues: list[SubtitleCue],
        source_language: str,
        target_language: str,
        batch_size: int = 25,
    ) -> list[TranslatedCue]:
        """Translate all cues, splitting into batches."""
        batches = [cues[i : i + batch_size] for i in range(0, len(cues), batch_size)]
        all_translated: list[TranslatedCue] = []

        logger.info(
            f"Translating {len(cues)} cues ({source_language} -> {target_language}) "
            f"in {len(batches)} batches"
        )

        for batch_idx, batch in enumerate(batches):
            logger.info(f"Batch {batch_idx + 1}/{len(batches)} ({len(batch)} cues)")
            translated = await self._translate_batch_with_retry(
                batch, source_language, target_language
            )
            all_translated.extend(translated)

        return all_translated

    async def _translate_batch_with_retry(
        self,
        cues: list[SubtitleCue],
        source_lang: str,
        target_lang: str,
    ) -> list[TranslatedCue]:
        """Translate a single batch with exponential-backoff retries."""
        last_error: Optional[Exception] = None

        for attempt in range(self.MAX_RETRIES):
            try:
                if attempt > 0:
                    wait = 2**attempt
                    logger.info(f"Retry {attempt + 1}/{self.MAX_RETRIES} after {wait}s")
                    await asyncio.sleep(wait)

                return await self._translate_batch(cues, source_lang, target_lang)

            except Exception as e:
                last_error = e
                logger.warning(f"Batch attempt {attempt + 1} failed: {e}")
                # Don't retry on auth / quota errors
                if "API key" in str(e) or "quota" in str(e):
                    raise

        raise last_error or RuntimeError("Translation failed after retries")

    async def _translate_batch(
        self,
        cues: list[SubtitleCue],
        source_lang: str,
        target_lang: str,
    ) -> list[TranslatedCue]:
        """Send one batch to Gemini and parse the response."""
        texts = [cue.text for cue in cues]
        prompt = self._build_prompt(texts, source_lang, target_lang)

        # Gemini SDK is synchronous — run in a thread to avoid blocking the event loop
        response = await asyncio.to_thread(
            self.model.generate_content, prompt
        )
        translated_texts = self._parse_response(response.text)

        # Build TranslatedCue list, falling back to original text if missing
        result: list[TranslatedCue] = []
        for idx, cue in enumerate(cues):
            translated_text = translated_texts[idx] if idx < len(translated_texts) else cue.text
            result.append(
                TranslatedCue(id=cue.id, text=cue.text, translated_text=translated_text)
            )
        return result

    @staticmethod
    def _build_prompt(texts: list[str], source_lang: str, target_lang: str) -> str:
        return (
            f"You are a professional subtitle translator. "
            f"Translate the following subtitle texts from {source_lang} to {target_lang}.\n\n"
            "CRITICAL INSTRUCTIONS:\n"
            "- Translate ONLY the text content\n"
            "- Maintain the EXACT same number of lines as the original\n"
            "- Preserve line breaks within each subtitle\n"
            "- Keep the same tone and context\n"
            "- Do NOT add explanations or comments\n"
            "- Return ONLY a JSON array of translated strings\n\n"
            f"Input ({len(texts)} subtitles):\n"
            f"{json.dumps(texts, ensure_ascii=False, indent=2)}\n\n"
            f"Output format:\n"
            f'Return a JSON array with {len(texts)} translated strings in the same order.\n\n'
            f'Example:\n["Translated text 1", "Translated text 2", ...]'
        )

    @staticmethod
    def _parse_response(response_text: str) -> list[str]:
        """Parse JSON array from Gemini response, stripping markdown fences."""
        cleaned = response_text.strip()
        # Strip markdown code block wrappers
        cleaned = re.sub(r"^```(?:json)?\s*\n?", "", cleaned)
        cleaned = re.sub(r"\n?```\s*$", "", cleaned)
        cleaned = cleaned.strip()

        parsed = json.loads(cleaned)
        if not isinstance(parsed, list):
            raise ValueError("Response is not a JSON array")
        return parsed


class TextTranslationService:
    """Service for translating plain text via Google Gemini API"""

    MODEL = "gemini-2.5-flash-lite"

    def __init__(self):
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY is required but not provided")
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(self.MODEL)

    async def translate(
        self,
        text: str,
        source_language: str,
        target_language: str,
    ) -> tuple[bool, Optional[str], Optional[str]]:
        """Translate text using Gemini. Returns (success, translated_text, error_message)."""
        source_instruction = (
            f"from {source_language} " if source_language != "Auto-detect" else ""
        )
        prompt = (
            f"You are a professional translator. "
            f"Translate the following text {source_instruction}to {target_language}.\n\n"
            "INSTRUCTIONS:\n"
            "- Provide ONLY the translated text, nothing else\n"
            "- Preserve the original formatting (paragraphs, line breaks)\n"
            "- Keep the same tone and style\n"
            "- Do NOT add explanations, notes, or comments\n\n"
            f"Text to translate:\n{text}"
        )

        try:
            response = await asyncio.to_thread(
                self.model.generate_content, prompt
            )
            translated = response.text.strip()
            logger.info(f"Text translation successful: {source_language} -> {target_language}")
            return True, translated, None

        except Exception as e:
            error_msg = f"Text translation failed: {str(e)}"
            logger.error(error_msg)
            return False, None, error_msg


class LanguageDetectionService:
    """Service for detecting the language of text via Google Gemini API"""

    MODEL = "gemini-2.5-flash-lite"

    def __init__(self):
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY is required but not provided")
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(self.MODEL)

    async def detect(self, text: str) -> tuple[bool, Optional[str], Optional[float], Optional[str]]:
        """Detect the language of the given text.
        Returns (success, detected_language, confidence, error_message).
        """
        prompt = (
            "You are a language identification expert. "
            "Detect the language of the following text.\n\n"
            "INSTRUCTIONS:\n"
            "- Return ONLY a JSON object with two keys: \"language\" and \"confidence\"\n"
            "- \"language\" should be the full English name of the language (e.g. \"Spanish\", \"Japanese\")\n"
            "- \"confidence\" should be a float between 0 and 1 indicating how confident you are\n"
            "- Do NOT add any explanation or text outside the JSON\n\n"
            f"Text:\n{text}"
        )

        try:
            response = await asyncio.to_thread(
                self.model.generate_content, prompt
            )
            result = self._parse_response(response.text)
            logger.info(f"Language detection: {result['language']} ({result['confidence']})")
            return True, result["language"], result["confidence"], None

        except Exception as e:
            error_msg = f"Language detection failed: {str(e)}"
            logger.error(error_msg)
            return False, None, None, error_msg

    @staticmethod
    def _parse_response(response_text: str) -> dict:
        """Parse JSON from Gemini response."""
        cleaned = response_text.strip()
        cleaned = re.sub(r"^```(?:json)?\s*\n?", "", cleaned)
        cleaned = re.sub(r"\n?```\s*$", "", cleaned)
        cleaned = cleaned.strip()

        parsed = json.loads(cleaned)
        if not isinstance(parsed, dict) or "language" not in parsed or "confidence" not in parsed:
            raise ValueError("Response must be a JSON object with 'language' and 'confidence' keys")
        return parsed


class TransliterationService:
    """Service for transliterating text between scripts via Google Gemini API"""

    MODEL = "gemini-2.5-flash-lite"

    def __init__(self):
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY is required but not provided")
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(self.MODEL)

    async def transliterate(
        self,
        text: str,
        source_script: str,
        target_script: str,
    ) -> tuple[bool, Optional[str], Optional[str], Optional[str]]:
        """Transliterate text between scripts.
        Returns (success, transliterated_text, detected_source_script, error_message).
        """
        source_instruction = (
            f"The text is written in {source_script} script. "
            if source_script != "Auto-detect"
            else "First identify the script/writing system of the text. "
        )

        prompt = (
            "You are a professional transliteration expert with deep knowledge of writing systems worldwide.\n\n"
            f"{source_instruction}"
            f"Transliterate the following text into {target_script}.\n\n"
            "CRITICAL INSTRUCTIONS:\n"
            "- Transliteration means converting the SOUND/PRONUNCIATION of the text into the target script, NOT translating the meaning\n"
            "- Preserve the original pronunciation as accurately as possible\n"
            "- Use standard/widely-accepted transliteration conventions:\n"
            "  * For Latin/Roman output: use the most common romanization system for the source language "
            "(e.g., Hepburn for Japanese, Pinyin for Chinese, IAST-inspired for Hindi/Sanskrit, "
            "ISO 233 inspired for Arabic)\n"
            "  * For non-Latin output: use the standard script conventions of the target writing system\n"
            "- Preserve spacing, punctuation, and line breaks\n"
            "- Keep numbers as-is unless they are written in a non-Latin numeral system and target is Latin\n"
            "- Do NOT translate the meaning — only convert the script\n"
            "- Do NOT add any explanations, notes, or annotations\n\n"
            "Return ONLY a JSON object with these keys:\n"
            '- "source_script": the detected or confirmed source script name (e.g. "Devanagari", "Arabic", "Katakana")\n'
            '- "result": the transliterated text\n\n'
            f"Text to transliterate:\n{text}"
        )

        try:
            response = await asyncio.to_thread(
                self.model.generate_content, prompt
            )
            result = self._parse_response(response.text)
            logger.info(
                f"Transliteration successful: {result['source_script']} -> {target_script}"
            )
            return True, result["result"], result["source_script"], None

        except Exception as e:
            error_msg = f"Transliteration failed: {str(e)}"
            logger.error(error_msg)
            return False, None, None, error_msg

    @staticmethod
    def _parse_response(response_text: str) -> dict:
        """Parse JSON from Gemini response."""
        cleaned = response_text.strip()
        cleaned = re.sub(r"^```(?:json)?\s*\n?", "", cleaned)
        cleaned = re.sub(r"\n?```\s*$", "", cleaned)
        cleaned = cleaned.strip()

        parsed = json.loads(cleaned)
        if not isinstance(parsed, dict) or "result" not in parsed or "source_script" not in parsed:
            raise ValueError("Response must be a JSON object with 'result' and 'source_script' keys")
        return parsed


# Global service instances
translation_service = TranslationService()
subtitle_translation_service = SubtitleTranslationService()
text_translation_service = TextTranslationService()
language_detection_service = LanguageDetectionService()
transliteration_service = TransliterationService()
