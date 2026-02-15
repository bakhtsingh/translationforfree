/**
 * Subtitle Parser Service
 * Handles parsing and formatting of SRT and VTT subtitle files
 */

import { SubtitleCue } from '../types';

/**
 * Parses an SRT subtitle file into structured cues
 *
 * SRT Format:
 * 1
 * 00:00:01,000 --> 00:00:04,000
 * Hello world
 *
 * @param content - Raw SRT file content
 * @returns Array of subtitle cues
 * @throws Error if format is invalid
 */
export function parseSRT(content: string): SubtitleCue[] {
  const cues: SubtitleCue[] = [];

  // Normalize line endings and split into blocks
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks = normalizedContent.split(/\n\s*\n/).filter(block => block.trim());

  for (const block of blocks) {
    const lines = block.split('\n').filter(line => line.trim());

    if (lines.length < 3) {
      continue; // Skip invalid blocks
    }

    // First line is the cue ID
    const id = lines[0].trim();

    // Second line is the timing
    const timingMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);

    if (!timingMatch) {
      console.warn(`Invalid timing format in cue ${id}:`, lines[1]);
      continue;
    }

    const startTime = parseSRTTimestamp(timingMatch[1]);
    const endTime = parseSRTTimestamp(timingMatch[2]);

    // Remaining lines are the text content
    const text = lines.slice(2).join('\n');

    cues.push({
      id,
      startTime,
      endTime,
      text,
    });
  }

  if (cues.length === 0) {
    throw new Error('No valid subtitle cues found in SRT file');
  }

  return cues;
}

/**
 * Parses a VTT subtitle file into structured cues
 *
 * VTT Format:
 * WEBVTT
 *
 * 1
 * 00:00:01.000 --> 00:00:04.000
 * Hello world
 *
 * @param content - Raw VTT file content
 * @returns Array of subtitle cues
 * @throws Error if format is invalid
 */
export function parseVTT(content: string): SubtitleCue[] {
  const cues: SubtitleCue[] = [];

  // Validate WEBVTT header
  if (!content.trim().startsWith('WEBVTT')) {
    throw new Error('Invalid VTT file: Missing WEBVTT header');
  }

  // Remove header and normalize line endings
  const normalizedContent = content
    .replace(/^WEBVTT[^\n]*\n/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  const blocks = normalizedContent.split(/\n\s*\n/).filter(block => block.trim());

  for (const block of blocks) {
    const lines = block.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      continue; // Skip invalid blocks
    }

    let idLine = 0;
    let timingLine = 0;
    let textStartLine = 1;

    // VTT cue ID is optional
    const firstLineTimingMatch = lines[0].match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/);

    if (firstLineTimingMatch) {
      // No ID, timing is on first line
      timingLine = 0;
      textStartLine = 1;
    } else {
      // Has ID, timing is on second line
      idLine = 0;
      timingLine = 1;
      textStartLine = 2;
    }

    const timingMatch = lines[timingLine].match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/);

    if (!timingMatch) {
      console.warn('Invalid timing format in VTT cue:', lines[timingLine]);
      continue;
    }

    const id = idLine !== timingLine ? lines[idLine].trim() : `cue-${cues.length + 1}`;
    const startTime = parseVTTTimestamp(timingMatch[1]);
    const endTime = parseVTTTimestamp(timingMatch[2]);
    const text = lines.slice(textStartLine).join('\n');

    cues.push({
      id,
      startTime,
      endTime,
      text,
    });
  }

  if (cues.length === 0) {
    throw new Error('No valid subtitle cues found in VTT file');
  }

  return cues;
}

/**
 * Formats subtitle cues back to SRT format
 *
 * @param cues - Array of subtitle cues
 * @returns Formatted SRT content
 */
export function formatToSRT(cues: SubtitleCue[]): string {
  return cues.map((cue, index) => {
    const id = cue.id || (index + 1).toString();
    const startTime = formatSRTTimestamp(cue.startTime);
    const endTime = formatSRTTimestamp(cue.endTime);
    const text = cue.translatedText || cue.text;

    return `${id}\n${startTime} --> ${endTime}\n${text}`;
  }).join('\n\n') + '\n';
}

/**
 * Formats subtitle cues back to VTT format
 *
 * @param cues - Array of subtitle cues
 * @returns Formatted VTT content
 */
export function formatToVTT(cues: SubtitleCue[]): string {
  const header = 'WEBVTT\n\n';
  const body = cues.map((cue, index) => {
    const id = cue.id || `cue-${index + 1}`;
    const startTime = formatVTTTimestamp(cue.startTime);
    const endTime = formatVTTTimestamp(cue.endTime);
    const text = cue.translatedText || cue.text;

    return `${id}\n${startTime} --> ${endTime}\n${text}`;
  }).join('\n\n');

  return header + body + '\n';
}

/**
 * Parses SRT timestamp (HH:MM:SS,mmm) to seconds
 *
 * @param timestamp - SRT timestamp string
 * @returns Time in seconds
 */
function parseSRTTimestamp(timestamp: string): number {
  const [time, ms] = timestamp.split(',');
  const [hours, minutes, seconds] = time.split(':').map(Number);

  return hours * 3600 + minutes * 60 + seconds + Number(ms) / 1000;
}

/**
 * Parses VTT timestamp (HH:MM:SS.mmm) to seconds
 *
 * @param timestamp - VTT timestamp string
 * @returns Time in seconds
 */
function parseVTTTimestamp(timestamp: string): number {
  const [time, ms] = timestamp.split('.');
  const [hours, minutes, seconds] = time.split(':').map(Number);

  return hours * 3600 + minutes * 60 + seconds + Number(ms) / 1000;
}

/**
 * Formats seconds to SRT timestamp (HH:MM:SS,mmm)
 *
 * @param seconds - Time in seconds
 * @returns SRT timestamp string
 */
function formatSRTTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(ms, 3)}`;
}

/**
 * Formats seconds to VTT timestamp (HH:MM:SS.mmm)
 *
 * @param seconds - Time in seconds
 * @returns VTT timestamp string
 */
function formatVTTTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}.${pad(ms, 3)}`;
}

/**
 * Pads a number with leading zeros
 *
 * @param num - Number to pad
 * @param length - Desired length (default: 2)
 * @returns Padded string
 */
function pad(num: number, length: number = 2): string {
  return num.toString().padStart(length, '0');
}

/**
 * Validates subtitle file format
 *
 * @param content - File content
 * @param format - Expected format ('srt' or 'vtt')
 * @returns True if valid, false otherwise
 */
export function validateFormat(content: string, format: 'srt' | 'vtt'): boolean {
  try {
    if (format === 'srt') {
      // Check for SRT timing pattern
      return /\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}/.test(content);
    } else {
      // Check for WEBVTT header and VTT timing pattern
      return content.trim().startsWith('WEBVTT') &&
             /\d{2}:\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}\.\d{3}/.test(content);
    }
  } catch {
    return false;
  }
}

/**
 * Detects subtitle format from file content
 *
 * @param content - File content
 * @returns Detected format or null if unknown
 */
export function detectFormat(content: string): 'srt' | 'vtt' | null {
  if (content.trim().startsWith('WEBVTT')) {
    return 'vtt';
  } else if (/\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}/.test(content)) {
    return 'srt';
  }
  return null;
}
