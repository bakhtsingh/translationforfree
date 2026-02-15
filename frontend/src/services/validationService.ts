/**
 * Validation Service
 * Handles validation of files, subtitles, and translation requests
 */

import { SubtitleCue } from '../types';
import { validateFileExtension, validateFileSize, getFileExtension } from './fileHandler';

// Configuration constants
export const MAX_FILE_SIZE_MB = 10;
export const MAX_CUES = 5000;
export const ALLOWED_EXTENSIONS = ['.srt', '.vtt'];

/**
 * Validation error type
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validates a subtitle file before upload
 *
 * @param file - File to validate
 * @returns Validation result
 */
export function validateSubtitleFile(file: File): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if file exists
  if (!file) {
    errors.push({
      field: 'file',
      message: 'No file selected',
    });
    return { valid: false, errors };
  }

  // Validate file extension
  if (!validateFileExtension(file.name, ALLOWED_EXTENSIONS)) {
    errors.push({
      field: 'file',
      message: `Invalid file type. Please upload a ${ALLOWED_EXTENSIONS.join(' or ')} file`,
    });
  }

  // Validate file size
  if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
    errors.push({
      field: 'file',
      message: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`,
    });
  }

  // Check if file is empty
  if (file.size === 0) {
    errors.push({
      field: 'file',
      message: 'File is empty',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates parsed subtitle cues
 *
 * @param cues - Subtitle cues to validate
 * @returns Validation result
 */
export function validateSubtitleCues(cues: SubtitleCue[]): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if cues exist
  if (!cues || cues.length === 0) {
    errors.push({
      field: 'cues',
      message: 'No subtitle cues found in file',
    });
    return { valid: false, errors };
  }

  // Check max cues limit
  if (cues.length > MAX_CUES) {
    errors.push({
      field: 'cues',
      message: `Too many subtitle cues. Maximum ${MAX_CUES} cues allowed`,
    });
  }

  // Validate individual cues
  for (let i = 0; i < Math.min(cues.length, 10); i++) {
    const cue = cues[i];

    if (!cue.text || cue.text.trim() === '') {
      errors.push({
        field: `cue-${i}`,
        message: `Cue ${i + 1} has empty text`,
      });
    }

    if (cue.startTime < 0 || cue.endTime < 0) {
      errors.push({
        field: `cue-${i}`,
        message: `Cue ${i + 1} has invalid timing`,
      });
    }

    if (cue.endTime <= cue.startTime) {
      errors.push({
        field: `cue-${i}`,
        message: `Cue ${i + 1} has end time before start time`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates translation request parameters
 *
 * @param sourceLanguage - Source language
 * @param targetLanguage - Target language
 * @param cues - Subtitle cues
 * @returns Validation result
 */
export function validateTranslationRequest(
  sourceLanguage: string,
  targetLanguage: string,
  cues: SubtitleCue[]
): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate source language
  if (!sourceLanguage || sourceLanguage.trim() === '') {
    errors.push({
      field: 'sourceLanguage',
      message: 'Source language is required',
    });
  }

  // Validate target language
  if (!targetLanguage || targetLanguage.trim() === '') {
    errors.push({
      field: 'targetLanguage',
      message: 'Target language is required',
    });
  }

  // Check if languages are different
  if (sourceLanguage && targetLanguage && sourceLanguage === targetLanguage) {
    errors.push({
      field: 'targetLanguage',
      message: 'Target language must be different from source language',
    });
  }

  // Validate cues
  const cueValidation = validateSubtitleCues(cues);
  if (!cueValidation.valid) {
    errors.push(...cueValidation.errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates file content format
 *
 * @param content - File content
 * @param expectedFormat - Expected format ('srt' or 'vtt')
 * @returns Validation result
 */
export function validateFileContent(
  content: string,
  expectedFormat: 'srt' | 'vtt'
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!content || content.trim() === '') {
    errors.push({
      field: 'content',
      message: 'File content is empty',
    });
    return { valid: false, errors };
  }

  // Check for expected format patterns
  if (expectedFormat === 'srt') {
    // SRT should have timing pattern with commas
    if (!/\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}/.test(content)) {
      errors.push({
        field: 'content',
        message: 'Invalid SRT format. No valid timing information found',
      });
    }
  } else if (expectedFormat === 'vtt') {
    // VTT should have WEBVTT header
    if (!content.trim().startsWith('WEBVTT')) {
      errors.push({
        field: 'content',
        message: 'Invalid VTT format. Missing WEBVTT header',
      });
    }

    // VTT should have timing pattern with periods
    if (!/\d{2}:\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}\.\d{3}/.test(content)) {
      errors.push({
        field: 'content',
        message: 'Invalid VTT format. No valid timing information found',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Gets a user-friendly error message from validation errors
 *
 * @param errors - Array of validation errors
 * @returns Formatted error message
 */
export function getErrorMessage(errors: ValidationError[]): string {
  if (errors.length === 0) return '';

  if (errors.length === 1) {
    return errors[0].message;
  }

  return `Multiple errors found:\n${errors.map(e => `- ${e.message}`).join('\n')}`;
}

/**
 * Checks if file has valid subtitle extension
 *
 * @param filename - Filename to check
 * @returns True if valid, false otherwise
 */
export function hasValidSubtitleExtension(filename: string): boolean {
  const extension = getFileExtension(filename);
  return ALLOWED_EXTENSIONS.includes(extension);
}
