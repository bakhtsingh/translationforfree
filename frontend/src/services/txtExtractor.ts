/**
 * Text Extractor Service
 * Pure client-side dialogue-text extraction from SRT/VTT cues — no backend needed.
 * Strips timestamps, indices, and (optionally) formatting tags.
 */

import { SubtitleCue } from '@/types/subtitle';

export type ExtractMode = 'lines' | 'paragraphs' | 'block';

export interface ExtractOptions {
  mode: ExtractMode;
  stripTags: boolean;
  paragraphGapSeconds?: number;
}

export interface ExtractResult {
  text: string;
  charCount: number;
  wordCount: number;
  lineCount: number;
}

const DEFAULT_PARAGRAPH_GAP = 3;

export function extractText(cues: SubtitleCue[], options: ExtractOptions): ExtractResult {
  const gap = options.paragraphGapSeconds ?? DEFAULT_PARAGRAPH_GAP;

  const lines = cues
    .map((cue) => {
      const raw = options.stripTags ? stripFormattingTags(cue.text) : cue.text;
      return {
        text: raw.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim(),
        startTime: cue.startTime,
        endTime: cue.endTime,
      };
    })
    .filter((c) => c.text.length > 0);

  let text: string;
  switch (options.mode) {
    case 'lines':
      text = lines.map((c) => c.text).join('\n');
      break;
    case 'block':
      text = lines.map((c) => c.text).join(' ');
      break;
    case 'paragraphs': {
      const paragraphs: string[] = [];
      let current: string[] = [];
      let prevEnd: number | null = null;
      for (const c of lines) {
        if (prevEnd !== null && c.startTime - prevEnd >= gap && current.length > 0) {
          paragraphs.push(current.join(' '));
          current = [];
        }
        current.push(c.text);
        prevEnd = c.endTime;
      }
      if (current.length > 0) paragraphs.push(current.join(' '));
      text = paragraphs.join('\n\n');
      break;
    }
  }

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lineCount = text === '' ? 0 : text.split('\n').length;

  return {
    text,
    charCount: text.length,
    wordCount,
    lineCount,
  };
}

function stripFormattingTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/\{\\[^}]*\}/g, '')
    .replace(/\{[^}]*\}/g, '');
}
