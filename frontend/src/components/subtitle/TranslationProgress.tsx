/**
 * Translation Progress Component
 * Shows translation progress with visual progress bar
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { useTranslation } from '../../contexts/TranslationContext';

export function TranslationProgress() {
  const { state } = useTranslation();

  if (!state.isTranslating || !state.translationProgress) {
    return null;
  }

  const { translated, total, percentage, currentBatch, totalBatches } = state.translationProgress;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Translating...
          </h3>
          <span className="text-sm font-medium text-primary">
            {percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <Progress value={percentage} className="h-2" />

        {/* Stats */}
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">{translated}</span> of{' '}
            <span className="font-medium text-foreground">{total}</span> subtitles translated
          </p>
          {currentBatch !== undefined && totalBatches !== undefined && (
            <p>
              Batch <span className="font-medium text-foreground">{currentBatch}</span> of{' '}
              <span className="font-medium text-foreground">{totalBatches}</span>
            </p>
          )}
        </div>

        {/* Tip */}
        <p className="text-xs text-muted-foreground">
          This may take a few minutes depending on file size...
        </p>
      </div>
    </Card>
  );
}
