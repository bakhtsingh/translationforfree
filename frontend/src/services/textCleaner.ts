/**
 * Text Cleaner Service
 * Pure client-side text cleaning — no backend needed.
 * Strip whitespace, line breaks, page numbers, footnote markers, timestamps,
 * duplicate lines; fix encoding mojibake; normalize smart quotes / dashes.
 * All operations are independent toggles. Presets bundle common combinations.
 */

export interface CleanOptions {
  fixEncoding: boolean;
  normalizeSmartQuotes: boolean;
  normalizeDashes: boolean;
  removeNonAscii: boolean;

  removeUrls: boolean;
  removeEmails: boolean;
  removeTimestamps: boolean;
  removeFootnoteMarkers: boolean;
  removePageNumbers: boolean;
  removeDuplicateLines: boolean;

  trimLines: boolean;
  collapseSpaces: boolean;
  removeEmptyLines: boolean;
  collapseBlankLines: boolean;
  removeAllLineBreaks: boolean;
}

export const DEFAULT_OPTIONS: CleanOptions = {
  fixEncoding: false,
  normalizeSmartQuotes: false,
  normalizeDashes: false,
  removeNonAscii: false,
  removeUrls: false,
  removeEmails: false,
  removeTimestamps: false,
  removeFootnoteMarkers: false,
  removePageNumbers: false,
  removeDuplicateLines: false,
  trimLines: false,
  collapseSpaces: false,
  removeEmptyLines: false,
  collapseBlankLines: false,
  removeAllLineBreaks: false,
};

export interface CleanStats {
  charCount: number;
  wordCount: number;
  lineCount: number;
}

export interface CleanResult {
  text: string;
  before: CleanStats;
  after: CleanStats;
}

export type PresetKey = 'basic' | 'chatgpt' | 'ocrPdf' | 'aggressive';

export const PRESETS: Record<PresetKey, { label: string; description: string; options: Partial<CleanOptions> }> = {
  basic: {
    label: 'Basic cleanup',
    description: 'Trim lines, collapse multiple spaces, drop excess blank lines.',
    options: {
      trimLines: true,
      collapseSpaces: true,
      collapseBlankLines: true,
    },
  },
  chatgpt: {
    label: 'Prepare for ChatGPT',
    description: 'Strip footnote markers, fix encoding, normalize quotes — clean input for AI.',
    options: {
      fixEncoding: true,
      normalizeSmartQuotes: true,
      removeFootnoteMarkers: true,
      removePageNumbers: true,
      collapseSpaces: true,
      trimLines: true,
      collapseBlankLines: true,
    },
  },
  ocrPdf: {
    label: 'Clean OCR / PDF text',
    description: 'Strip page numbers, footnote markers, timestamps, encoding artifacts from copied PDF text.',
    options: {
      fixEncoding: true,
      normalizeSmartQuotes: true,
      normalizeDashes: true,
      removeTimestamps: true,
      removeFootnoteMarkers: true,
      removePageNumbers: true,
      collapseSpaces: true,
      trimLines: true,
      collapseBlankLines: true,
    },
  },
  aggressive: {
    label: 'Strip everything',
    description: 'All cleaning operations except remove-all-line-breaks. Use with caution.',
    options: {
      fixEncoding: true,
      normalizeSmartQuotes: true,
      normalizeDashes: true,
      removeUrls: true,
      removeEmails: true,
      removeTimestamps: true,
      removeFootnoteMarkers: true,
      removePageNumbers: true,
      removeDuplicateLines: true,
      trimLines: true,
      collapseSpaces: true,
      removeEmptyLines: true,
    },
  },
};

const ENCODING_FIXES: Array<[RegExp, string]> = [
  [/â€™/g, "'"],
  [/â€œ/g, '"'],
  [/â€/g, '"'],
  [/â€”/g, '—'],
  [/â€“/g, '–'],
  [/â€¦/g, '…'],
  [/Ã©/g, 'é'],
  [/Ã¨/g, 'è'],
  [/Ãª/g, 'ê'],
  [/Ã /g, 'à'],
  [/Ã§/g, 'ç'],
  [/Ã±/g, 'ñ'],
  [/Ã¶/g, 'ö'],
  [/Ã¼/g, 'ü'],
  [/Ã/g, 'ß'],
  [/Â/g, ''],
  [/﻿/g, ''],
  [/ /g, ' '],
];

const SMART_QUOTES_FIXES: Array<[RegExp, string]> = [
  [/[“”„‟]/g, '"'],
  [/[‘’‚‛]/g, "'"],
];

const DASHES_FIXES: Array<[RegExp, string]> = [
  [/[–—―]/g, '-'],
];

const URL_REGEX = /https?:\/\/\S+|www\.\S+/g;
const EMAIL_REGEX = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const TIMESTAMP_REGEX = /\[?\(?\d{1,2}:\d{2}(?::\d{2})?\)?\]?/g;
const FOOTNOTE_REGEX = /\[\d+(?:[,\s]\d+)*\]|[¹²³⁰-⁹]+/g;
const PAGE_LINE_REGEX = /^\s*(?:page\s+\d+|p\.?\s*\d+|-+\s*\d+\s*-+|\d+\s*(?:of|\/)\s*\d+|\d+)\s*$/i;

function countStats(s: string): CleanStats {
  const trimmed = s.trim();
  return {
    charCount: s.length,
    wordCount: trimmed === '' ? 0 : trimmed.split(/\s+/).length,
    lineCount: s === '' ? 0 : s.split('\n').length,
  };
}

function applyReplacements(text: string, replacements: Array<[RegExp, string]>): string {
  let out = text;
  for (const [pattern, replacement] of replacements) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

export function cleanText(input: string, options: CleanOptions): CleanResult {
  const before = countStats(input);
  let text = input;

  if (options.fixEncoding) text = applyReplacements(text, ENCODING_FIXES);
  if (options.normalizeSmartQuotes) text = applyReplacements(text, SMART_QUOTES_FIXES);
  if (options.normalizeDashes) text = applyReplacements(text, DASHES_FIXES);
  if (options.removeNonAscii) text = text.replace(/[^\x00-\x7F]/g, '');

  if (options.removeUrls) text = text.replace(URL_REGEX, '');
  if (options.removeEmails) text = text.replace(EMAIL_REGEX, '');
  if (options.removeTimestamps) text = text.replace(TIMESTAMP_REGEX, '');
  if (options.removeFootnoteMarkers) text = text.replace(FOOTNOTE_REGEX, '');

  const needsLineWork =
    options.removePageNumbers ||
    options.trimLines ||
    options.removeEmptyLines ||
    options.removeDuplicateLines;

  if (needsLineWork) {
    let lines = text.split('\n');
    if (options.removePageNumbers) lines = lines.filter((l) => !PAGE_LINE_REGEX.test(l));
    if (options.trimLines) lines = lines.map((l) => l.trim());
    if (options.removeEmptyLines) lines = lines.filter((l) => l.trim() !== '');
    if (options.removeDuplicateLines) {
      const out: string[] = [];
      let prev: string | null = null;
      for (const l of lines) {
        if (l !== prev) out.push(l);
        prev = l;
      }
      lines = out;
    }
    text = lines.join('\n');
  }

  if (options.collapseSpaces) text = text.replace(/[ \t]+/g, ' ');
  if (options.collapseBlankLines) text = text.replace(/\n{3,}/g, '\n\n');
  if (options.removeAllLineBreaks) text = text.replace(/\s*\n+\s*/g, ' ').trim();

  const after = countStats(text);

  return { text, before, after };
}
