/**
 * Types for the Transliteration tool
 */

export interface TransliterationRequest {
  text: string;
  sourceScript: string;
  targetScript: string;
}

export interface TransliterationResponse {
  success: boolean;
  transliterated_text: string | null;
  source_script: string | null;
  target_script: string;
  error_message: string | null;
}
