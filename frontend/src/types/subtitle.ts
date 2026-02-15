/**
 * Core subtitle types for SRT/VTT translation
 */

/**
 * Represents a single subtitle cue with timing and text
 */
export interface SubtitleCue {
  /** Unique identifier for the cue */
  id: string;

  /** Start time in seconds */
  startTime: number;

  /** End time in seconds */
  endTime: number;

  /** Original text content */
  text: string;

  /** Translated text content (if available) */
  translatedText?: string;
}

/**
 * Represents a complete subtitle file with metadata
 */
export interface SubtitleFile {
  /** Original filename */
  fileName: string;

  /** File format (SRT or VTT) */
  format: 'srt' | 'vtt';

  /** Array of subtitle cues */
  cues: SubtitleCue[];

  /** File metadata */
  metadata: {
    /** File size in bytes */
    fileSize: number;

    /** Total number of cues */
    totalCues: number;

    /** Total duration in seconds */
    duration: number;
  };
}

/**
 * Translation status states
 */
export type TranslationStatus =
  | 'idle'          // No file uploaded
  | 'parsing'       // Parsing uploaded file
  | 'translating'   // Translation in progress
  | 'completed'     // Translation finished
  | 'error';        // Error occurred

/**
 * Translation progress information
 */
export interface TranslationProgress {
  /** Number of cues translated */
  translated: number;

  /** Total number of cues */
  total: number;

  /** Progress percentage (0-100) */
  percentage: number;

  /** Current batch being processed */
  currentBatch?: number;

  /** Total number of batches */
  totalBatches?: number;
}

/**
 * Translation error details
 */
export interface TranslationError {
  /** Error message */
  message: string;

  /** Error code */
  code?: string;

  /** Cue ID where error occurred (if applicable) */
  cueId?: string;
}

/**
 * Language option for selection
 */
export interface LanguageOption {
  /** Language code (e.g., 'en', 'es') */
  code: string;

  /** Display name (e.g., 'English', 'Spanish') */
  name: string;
}
