/**
 * File Handler Service
 * Handles file reading and downloading operations
 */

import { SubtitleCue } from '../types';
import { formatToSRT, formatToVTT } from './subtitleParser';

/**
 * Reads a file as text
 *
 * @param file - File to read
 * @returns Promise with file content
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result;

      if (typeof content === 'string') {
        resolve(content);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Downloads subtitle cues as a file
 *
 * @param cues - Subtitle cues to download
 * @param format - File format ('srt' or 'vtt')
 * @param originalFilename - Original filename (for generating download name)
 */
export function downloadSubtitleFile(
  cues: SubtitleCue[],
  format: 'srt' | 'vtt',
  originalFilename: string
): void {
  try {
    // Format cues based on file format
    const content = format === 'srt' ? formatToSRT(cues) : formatToVTT(cues);

    // Create blob
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

    // Generate download filename
    const downloadFilename = generateDownloadFilename(originalFilename, format);

    // Create download link and trigger
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`📥 Downloaded: ${downloadFilename}`);
  } catch (error) {
    console.error('❌ Download failed:', error);
    throw new Error('Failed to download subtitle file');
  }
}

/**
 * Copies subtitle content to clipboard as fallback
 *
 * @param cues - Subtitle cues
 * @param format - File format ('srt' or 'vtt')
 * @returns Promise that resolves when copied
 */
export async function copySubtitleToClipboard(
  cues: SubtitleCue[],
  format: 'srt' | 'vtt'
): Promise<void> {
  try {
    const content = format === 'srt' ? formatToSRT(cues) : formatToVTT(cues);

    await navigator.clipboard.writeText(content);

    console.log('📋 Copied to clipboard');
  } catch (error) {
    console.error('❌ Copy to clipboard failed:', error);
    throw new Error('Failed to copy to clipboard');
  }
}

/**
 * Validates file size
 *
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in megabytes
 * @returns True if valid, false otherwise
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

/**
 * Validates file extension
 *
 * @param filename - Filename to validate
 * @param allowedExtensions - Array of allowed extensions (e.g., ['.srt', '.vtt'])
 * @returns True if valid, false otherwise
 */
export function validateFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const extension = getFileExtension(filename);
  return allowedExtensions.includes(extension);
}

/**
 * Gets file extension from filename
 *
 * @param filename - Filename
 * @returns File extension (including dot, e.g., '.srt')
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot).toLowerCase() : '';
}

/**
 * Gets file format from extension
 *
 * @param filename - Filename
 * @returns File format ('srt' or 'vtt') or null if unknown
 */
export function getFileFormat(filename: string): 'srt' | 'vtt' | null {
  const extension = getFileExtension(filename);

  switch (extension) {
    case '.srt':
      return 'srt';
    case '.vtt':
      return 'vtt';
    default:
      return null;
  }
}

/**
 * Formats file size for display
 *
 * @param bytes - File size in bytes
 * @returns Formatted size string (e.g., '1.5 MB')
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Generates a download filename with translated suffix
 *
 * @param originalFilename - Original filename
 * @param format - File format
 * @returns Generated download filename
 */
function generateDownloadFilename(originalFilename: string, format: 'srt' | 'vtt'): string {
  const extension = getFileExtension(originalFilename);
  const basename = originalFilename.substring(0, originalFilename.length - extension.length);

  // Add _translated suffix if not already present
  const translatedBasename = basename.endsWith('_translated') ? basename : `${basename}_translated`;

  return `${translatedBasename}.${format}`;
}

/**
 * Calculates total duration from subtitle cues
 *
 * @param cues - Subtitle cues
 * @returns Total duration in seconds
 */
export function calculateTotalDuration(cues: SubtitleCue[]): number {
  if (cues.length === 0) return 0;

  const lastCue = cues[cues.length - 1];
  return lastCue.endTime;
}

/**
 * Formats duration for display (HH:MM:SS)
 *
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(secs)}`;
  } else {
    return `${minutes}:${pad(secs)}`;
  }
}

/**
 * Pads a number with leading zero
 *
 * @param num - Number to pad
 * @returns Padded string
 */
function pad(num: number): string {
  return num.toString().padStart(2, '0');
}
