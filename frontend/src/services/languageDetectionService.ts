/**
 * Language Detection Service
 * Calls the backend /detect/language endpoint (Gemini-powered).
 */

import { LanguageDetectionRequest, LanguageDetectionResponse } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://translationforfree-737270753447.us-south1.run.app';

export async function detectLanguage(
  request: LanguageDetectionRequest
): Promise<LanguageDetectionResponse> {
  const response = await fetch(`${API_BASE_URL}/detect/language`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: request.text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
