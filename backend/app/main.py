"""
Main FastAPI application
"""
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.models import (
    TranslationRequest,
    TranslationResponse,
    HealthResponse,
    SubtitleTranslationRequest,
    SubtitleTranslationResponse,
    TextTranslationRequest,
    TextTranslationResponse,
    LanguageDetectionRequest,
    LanguageDetectionResponse,
    TransliterationRequest,
    TransliterationResponse,
)
from app.services import (
    translation_service,
    subtitle_translation_service,
    text_translation_service,
    language_detection_service,
    transliteration_service,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.debug else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    yield
    logger.info("Shutting down application")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description=settings.description,
    version=settings.app_version,
    debug=settings.debug,
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=settings.allowed_methods,
    allow_headers=settings.allowed_headers,
)


@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        version=settings.app_version,
        message="Translation API is running",
    )


@app.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    """Translate text from source language to target language (Chipp AI)."""
    try:
        logger.info(f"Translation request: {request.source_language} -> {request.target_language}")

        success, translated_text, error_message = await translation_service.translate(
            text=request.text,
            source_language=request.source_language,
            target_language=request.target_language,
        )

        return TranslationResponse(
            success=success,
            translated_text=translated_text,
            source_language=request.source_language,
            target_language=request.target_language,
            original_text=request.text,
            error_message=error_message,
        )

    except Exception as e:
        logger.error(f"Unexpected error in translate endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/translate/subtitle", response_model=SubtitleTranslationResponse)
async def translate_subtitles(request: SubtitleTranslationRequest):
    """Translate subtitle cues via Gemini API (server-side, key never exposed)."""
    try:
        logger.info(
            f"Subtitle translation: {len(request.cues)} cues, "
            f"{request.source_language} -> {request.target_language}"
        )

        translated_cues = await subtitle_translation_service.translate_subtitles(
            cues=request.cues,
            source_language=request.source_language,
            target_language=request.target_language,
            batch_size=request.batch_size,
        )

        return SubtitleTranslationResponse(success=True, translated_cues=translated_cues)

    except Exception as e:
        logger.error(f"Subtitle translation failed: {e}")
        return SubtitleTranslationResponse(
            success=False,
            error_message=str(e),
        )


@app.post("/translate/text", response_model=TextTranslationResponse)
async def translate_text_gemini(request: TextTranslationRequest):
    """Translate plain text via Gemini API."""
    try:
        logger.info(
            f"Text translation: {request.source_language} -> {request.target_language} "
            f"({len(request.text)} chars)"
        )

        success, translated_text, error_message = await text_translation_service.translate(
            text=request.text,
            source_language=request.source_language,
            target_language=request.target_language,
        )

        return TextTranslationResponse(
            success=success,
            translated_text=translated_text,
            source_language=request.source_language,
            target_language=request.target_language,
            error_message=error_message,
        )

    except Exception as e:
        logger.error(f"Text translation endpoint failed: {e}")
        return TextTranslationResponse(
            success=False,
            source_language=request.source_language,
            target_language=request.target_language,
            error_message=str(e),
        )


@app.post("/detect/language", response_model=LanguageDetectionResponse)
async def detect_language(request: LanguageDetectionRequest):
    """Detect the language of the given text via Gemini API."""
    try:
        logger.info(f"Language detection request ({len(request.text)} chars)")

        success, detected_language, confidence, error_message = await language_detection_service.detect(
            text=request.text,
        )

        return LanguageDetectionResponse(
            success=success,
            detected_language=detected_language,
            confidence=confidence,
            error_message=error_message,
        )

    except Exception as e:
        logger.error(f"Language detection endpoint failed: {e}")
        return LanguageDetectionResponse(
            success=False,
            error_message=str(e),
        )


@app.post("/transliterate", response_model=TransliterationResponse)
async def transliterate_text(request: TransliterationRequest):
    """Transliterate text between writing systems via Gemini API."""
    try:
        logger.info(
            f"Transliteration request: {request.source_script} -> {request.target_script} "
            f"({len(request.text)} chars)"
        )

        success, transliterated_text, source_script, error_message = (
            await transliteration_service.transliterate(
                text=request.text,
                source_script=request.source_script,
                target_script=request.target_script,
            )
        )

        return TransliterationResponse(
            success=success,
            transliterated_text=transliterated_text,
            source_script=source_script or request.source_script,
            target_script=request.target_script,
            error_message=error_message,
        )

    except Exception as e:
        logger.error(f"Transliteration endpoint failed: {e}")
        return TransliterationResponse(
            success=False,
            source_script=request.source_script,
            target_script=request.target_script,
            error_message=str(e),
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info" if settings.debug else "warning",
    )
