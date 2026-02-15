/**
 * Types for the Text Translation feature
 */

export interface TextTranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TextTranslationResponse {
  success: boolean;
  translated_text: string | null;
  source_language: string;
  target_language: string;
  error_message: string | null;
}
