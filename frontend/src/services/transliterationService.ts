/**
 * Transliteration Service
 * Calls the backend /transliterate endpoint (Gemini-powered).
 */

import { TransliterationRequest, TransliterationResponse } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://translationforfree-737270753447.us-south1.run.app';

export async function transliterateText(
  request: TransliterationRequest
): Promise<TransliterationResponse> {
  const response = await fetch(`${API_BASE_URL}/transliterate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: request.text,
      source_script: request.sourceScript,
      target_script: request.targetScript,
    }),
  });

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
