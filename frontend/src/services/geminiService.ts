/**
 * Translation Service
 * Routes subtitle translation through the backend API (Gemini key stays server-side).
 */

import {
  SubtitleCue,
  TranslationRequest,
  TranslationResponse,
  TranslationProgressCallback,
} from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://translationforfree-737270753447.us-south1.run.app';

const DEFAULT_BATCH_SIZE = 25;

/**
 * Translates subtitle cues by calling the backend /translate/subtitle endpoint.
 * The backend handles batching, retries, and Gemini API calls.
 */
export async function translateSubtitles(
  request: TranslationRequest,
  onProgress?: TranslationProgressCallback
): Promise<TranslationResponse> {
  try {
    const { cues, sourceLanguage, targetLanguage, batchSize = DEFAULT_BATCH_SIZE } = request;

    // Show initial progress
    if (onProgress) {
      onProgress({
        translated: 0,
        total: cues.length,
        percentage: 0,
        currentBatch: 1,
        totalBatches: 1,
      });
    }

    console.log(
      `Translating ${cues.length} cues from ${sourceLanguage} to ${targetLanguage} via backend`
    );

    const response = await fetch(`${API_BASE_URL}/translate/subtitle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cues: cues.map((cue) => ({ id: cue.id, text: cue.text })),
        source_language: sourceLanguage,
        target_language: targetLanguage,
        batch_size: batchSize,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error_message || 'Translation failed on backend');
    }

    // Map backend response back into SubtitleCue format
    const translatedCues: SubtitleCue[] = cues.map((originalCue) => {
      const match = data.translated_cues.find(
        (tc: { id: string; translated_text: string }) => tc.id === originalCue.id
      );
      return {
        ...originalCue,
        translatedText: match?.translated_text || originalCue.text,
      };
    });

    // Final progress
    if (onProgress) {
      onProgress({
        translated: cues.length,
        total: cues.length,
        percentage: 100,
        currentBatch: 1,
        totalBatches: 1,
      });
    }

    console.log('Translation completed successfully');

    return {
      translatedCues,
      success: true,
    };
  } catch (error) {
    console.error('Translation failed:', error);

    return {
      translatedCues: [],
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Translation failed',
        code: 'TRANSLATION_ERROR',
      },
    };
  }
}

/**
 * Estimates translation time based on number of cues
 */
export function estimateTranslationTime(
  totalCues: number,
  batchSize: number = DEFAULT_BATCH_SIZE
): number {
  const batches = Math.ceil(totalCues / batchSize);
  const avgTimePerBatch = 3; // seconds
  return batches * avgTimePerBatch;
}
