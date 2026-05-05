/**
 * Timing Shifter Service
 * Pure client-side subtitle cue timing offset — no backend needed.
 * Positive offset = later (delays subtitles).
 * Negative offset = earlier (advances subtitles).
 */

import { SubtitleCue } from '@/types/subtitle';

export interface ShiftResult {
  cues: SubtitleCue[];
  cuesIn: number;
  cuesOut: number;
  cuesClamped: number;
  cuesDropped: number;
}

export function shiftCues(cues: SubtitleCue[], offsetSeconds: number): ShiftResult {
  let cuesClamped = 0;
  let cuesDropped = 0;
  const shifted: SubtitleCue[] = [];

  for (const cue of cues) {
    const newStart = cue.startTime + offsetSeconds;
    const newEnd = cue.endTime + offsetSeconds;

    if (newEnd <= 0) {
      cuesDropped++;
      continue;
    }

    if (newStart < 0) {
      cuesClamped++;
      shifted.push({ ...cue, startTime: 0, endTime: newEnd });
    } else {
      shifted.push({ ...cue, startTime: newStart, endTime: newEnd });
    }
  }

  return {
    cues: shifted,
    cuesIn: cues.length,
    cuesOut: shifted.length,
    cuesClamped,
    cuesDropped,
  };
}
