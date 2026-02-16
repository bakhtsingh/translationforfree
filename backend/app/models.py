"""
Pydantic models for API request/response schemas
"""
from typing import Optional
from pydantic import BaseModel, Field, validator

class TranslationRequest(BaseModel):
    """Request model for translation"""
    text: str = Field(..., min_length=1, max_length=5000, description="Text to translate")
    source_language: str = Field(default="English", description="Source language")
    target_language: str = Field(default="Telugu", description="Target language")
    
    @validator('text')
    def validate_text(cls, v):
        if not v.strip():
            raise ValueError('Text cannot be empty or only whitespace')
        return v.strip()
    
    @validator('source_language', 'target_language')
    def validate_language(cls, v):
        if not v.strip():
            raise ValueError('Language cannot be empty')
        return v.strip()

class TranslationResponse(BaseModel):
    """Response model for translation"""
    success: bool = Field(..., description="Whether the translation was successful")
    translated_text: Optional[str] = Field(None, description="The translated text")
    source_language: str = Field(..., description="Source language used")
    target_language: str = Field(..., description="Target language used")
    original_text: str = Field(..., description="Original text that was translated")
    error_message: Optional[str] = Field(None, description="Error message if translation failed")

class HealthResponse(BaseModel):
    """Health check response model"""
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
    message: str = Field(..., description="Status message")

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = Field(default=False, description="Always false for errors")
    error: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Error code")


# --- Subtitle Translation Models ---

class SubtitleCue(BaseModel):
    """A single subtitle cue"""
    id: str = Field(..., description="Cue identifier")
    text: str = Field(..., description="Original text")

class SubtitleTranslationRequest(BaseModel):
    """Request model for subtitle translation"""
    cues: list[SubtitleCue] = Field(..., min_length=1, description="Subtitle cues to translate")
    source_language: str = Field(default="English", description="Source language")
    target_language: str = Field(default="Spanish", description="Target language")
    batch_size: int = Field(default=25, ge=1, le=100, description="Cues per batch")

class TranslatedCue(BaseModel):
    """A translated subtitle cue"""
    id: str
    text: str
    translated_text: str

class SubtitleTranslationResponse(BaseModel):
    """Response model for subtitle translation"""
    success: bool
    translated_cues: list[TranslatedCue] = []
    error_message: Optional[str] = None


# --- Text Translation (Gemini) Models ---

class TextTranslationRequest(BaseModel):
    """Request model for Gemini-powered text translation"""
    text: str = Field(..., min_length=1, max_length=5000, description="Text to translate")
    source_language: str = Field(default="Auto-detect", description="Source language (or 'Auto-detect')")
    target_language: str = Field(..., description="Target language")

    @validator('text')
    def validate_text(cls, v):
        if not v.strip():
            raise ValueError('Text cannot be empty or only whitespace')
        return v.strip()

    @validator('target_language')
    def validate_target_language(cls, v):
        if not v.strip():
            raise ValueError('Target language cannot be empty')
        return v.strip()

class TextTranslationResponse(BaseModel):
    """Response model for Gemini-powered text translation"""
    success: bool
    translated_text: Optional[str] = None
    source_language: str
    target_language: str
    error_message: Optional[str] = None


# --- Language Detection Models ---

class LanguageDetectionRequest(BaseModel):
    """Request model for language detection"""
    text: str = Field(..., min_length=1, max_length=5000, description="Text to detect language of")

    @validator('text')
    def validate_text(cls, v):
        if not v.strip():
            raise ValueError('Text cannot be empty or only whitespace')
        return v.strip()

class LanguageDetectionResponse(BaseModel):
    """Response model for language detection"""
    success: bool
    detected_language: Optional[str] = None
    confidence: Optional[float] = Field(None, ge=0, le=1, description="Confidence score 0-1")
    error_message: Optional[str] = None
