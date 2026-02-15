/**
 * Text Translation Service
 * Calls the backend /translate/text endpoint (Gemini-powered).
 */

import { TextTranslationRequest, TextTranslationResponse } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://translationforfree-737270753447.us-south1.run.app';

export async function translateText(
  request: TextTranslationRequest
): Promise<TextTranslationResponse> {
  const response = await fetch(`${API_BASE_URL}/translate/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: request.text,
      source_language: request.sourceLanguage,
      target_language: request.targetLanguage,
    }),
  });

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
