/**
 * Types for the Language Detection feature
 */

export interface LanguageDetectionRequest {
  text: string;
}

export interface LanguageDetectionResponse {
  success: boolean;
  detected_language: string | null;
  confidence: number | null;
  error_message: string | null;
}
