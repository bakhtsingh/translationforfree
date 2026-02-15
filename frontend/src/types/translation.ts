/**
 * Translation-related types
 */

import { SubtitleCue, TranslationProgress, TranslationError } from './subtitle';

/**
 * Translation request configuration
 */
export interface TranslationRequest {
  /** Cues to translate */
  cues: SubtitleCue[];

  /** Source language code */
  sourceLanguage: string;

  /** Target language code */
  targetLanguage: string;

  /** Batch size (default: 25) */
  batchSize?: number;
}

/**
 * Translation response from Gemini API
 */
export interface TranslationResponse {
  /** Successfully translated cues */
  translatedCues: SubtitleCue[];

  /** Whether translation was successful */
  success: boolean;

  /** Error details if failed */
  error?: TranslationError;
}

/**
 * Translation batch for processing
 */
export interface TranslationBatch {
  /** Cues in this batch */
  cues: SubtitleCue[];

  /** Batch index (0-based) */
  batchIndex: number;

  /** Total number of batches */
  totalBatches: number;
}

/**
 * Callback for translation progress updates
 */
export type TranslationProgressCallback = (progress: TranslationProgress) => void;

/**
 * Translation service configuration
 */
export interface TranslationConfig {
  /** Gemini API key */
  apiKey: string;

  /** Model to use (default: 'gemini-2.5-flash-lite') */
  model?: string;

  /** Request timeout in ms (default: 30000) */
  timeout?: number;

  /** Maximum retries for failed requests (default: 3) */
  maxRetries?: number;
}
