/**
 * TextResult Component
 * Translated text panel with language selector, copy/download, skeleton loader, empty state
 */

import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TextResultProps {
  translatedText: string;
  isTranslating: boolean;
  targetLanguage: string;
  onLanguageChange: (lang: string) => void;
  languages: string[];
}

export function TextResult({
  translatedText,
  isTranslating,
  targetLanguage,
  onLanguageChange,
  languages,
}: TextResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasResult = translatedText.length > 0;

  return (
    <Card className="p-4 flex flex-col h-[350px] md:h-[450px] bg-muted/30">
      {/* Header: language selector + action buttons */}
      <div className="flex items-center justify-between mb-3">
        <Select value={targetLanguage} onValueChange={onLanguageChange} disabled={isTranslating}>
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasResult && (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-2 text-xs">
              {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8 px-2 text-xs">
              <Download className="h-3.5 w-3.5 mr-1" /> Download
            </Button>
          </div>
        )}
      </div>

      {/* Result area */}
      <div className="flex-1 rounded-md border bg-background/50 p-3 overflow-y-auto">
        {isTranslating && !hasResult ? (
          /* Skeleton loader */
          <div className="space-y-3 animate-pulse pt-1">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-4/6" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        ) : hasResult ? (
          <p className="whitespace-pre-wrap text-sm">{translatedText}</p>
        ) : (
          <p className="text-sm text-muted-foreground/50">Translation will appear here...</p>
        )}
      </div>

    </Card>
  );
}
