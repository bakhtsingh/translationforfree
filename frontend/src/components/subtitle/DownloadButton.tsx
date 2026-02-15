/**
 * Download Button Component
 * Allows downloading of translated subtitles
 */

import React, { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from '../../contexts/TranslationContext';
import { downloadSubtitleFile, copySubtitleToClipboard } from '../../services/fileHandler';

export function DownloadButton() {
  const { state } = useTranslation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    if (!state.subtitleFile || !state.canDownload) return;

    try {
      downloadSubtitleFile(
        state.subtitleFile.cues,
        state.subtitleFile.format,
        state.subtitleFile.fileName
      );

      toast({
        title: 'Download started',
        description: 'Your translated subtitle file is being downloaded',
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: error instanceof Error ? error.message : 'Failed to download file',
        variant: 'destructive',
      });
    }
  };

  const handleCopy = async () => {
    if (!state.subtitleFile || !state.canDownload) return;

    try {
      await copySubtitleToClipboard(
        state.subtitleFile.cues,
        state.subtitleFile.format
      );

      setCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'Translated subtitles copied successfully',
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: error instanceof Error ? error.message : 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  if (!state.subtitleFile) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Download</h3>

        {state.canDownload ? (
          <div className="space-y-3">
            <Button
              onClick={handleDownload}
              className="w-full"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Translated File
            </Button>

            <Button
              onClick={handleCopy}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Format: {state.subtitleFile.format.toUpperCase()}
            </p>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            <p className="text-sm">
              {state.isTranslating
                ? 'Translation in progress...'
                : 'Translate your subtitles to download'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
