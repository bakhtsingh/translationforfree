/**
 * Subtitle Editor Component
 * Displays subtitles in a table with editable translations
 */

import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { useTranslation, useTranslationActions } from '../../contexts/TranslationContext';
import { formatDuration } from '../../services/fileHandler';

export function SubtitleEditor() {
  const { state } = useTranslation();
  const actions = useTranslationActions();
  const [editingCueId, setEditingCueId] = useState<string | null>(null);

  if (!state.subtitleFile) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <p>Upload a subtitle file to begin</p>
        </div>
      </Card>
    );
  }

  const handleCueEdit = (cueId: string, newText: string) => {
    actions.updateCueText(cueId, newText);
  };

  const { cues } = state.subtitleFile;
  const hasTranslations = cues.some(cue => cue.translatedText);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          Subtitles {hasTranslations && '- Translated'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {cues.length} cues • {formatDuration(state.subtitleFile.metadata.duration)}
        </p>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {cues.map((cue, index) => (
            <div
              key={cue.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              {/* Header with timing */}
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="font-medium text-primary">#{index + 1}</span>
                <span className="text-muted-foreground">
                  {formatDuration(cue.startTime)} → {formatDuration(cue.endTime)}
                </span>
              </div>

              {/* Two-column layout for original and translated */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Text */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Original ({state.sourceLanguage})
                  </label>
                  <div className="text-sm bg-muted/30 p-3 rounded border">
                    {cue.text}
                  </div>
                </div>

                {/* Translated Text */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Translation ({state.targetLanguage})
                  </label>
                  {cue.translatedText ? (
                    <Textarea
                      value={cue.translatedText}
                      onChange={(e) => handleCueEdit(cue.id, e.target.value)}
                      className="min-h-[80px] text-sm"
                      placeholder="Translated text will appear here..."
                      disabled={state.isTranslating}
                    />
                  ) : (
                    <div className="text-sm bg-muted/30 p-3 rounded border text-muted-foreground italic">
                      {state.isTranslating ? 'Translating...' : 'Not yet translated'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
