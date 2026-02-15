/**
 * TextInput Component
 * Source text panel with language selector, clear button, translate button, char count
 */

import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MAX_CHARS = 5000;

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onTranslate: () => void;
  sourceLanguage: string;
  onLanguageChange: (lang: string) => void;
  languages: string[];
  isTranslating: boolean;
  canTranslate: boolean;
}

export function TextInput({
  value,
  onChange,
  onClear,
  onTranslate,
  sourceLanguage,
  onLanguageChange,
  languages,
  isTranslating,
  canTranslate,
}: TextInputProps) {
  const charCount = value.length;

  return (
    <Card className="p-4 flex flex-col h-[350px] md:h-[450px]">
      {/* Header: language selector + clear button */}
      <div className="flex items-center justify-between mb-3">
        <Select value={sourceLanguage} onValueChange={onLanguageChange} disabled={isTranslating}>
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Auto-detect">Auto-detect</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {value.length > 0 && (
          <Button variant="ghost" size="icon" onClick={onClear} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Textarea */}
      <Textarea
        placeholder="Type or paste your text here..."
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canTranslate) {
            e.preventDefault();
            onTranslate();
          }
        }}
        disabled={isTranslating}
        className="resize-none overflow-y-auto flex-1"
      />

      {/* Footer: char count + translate button */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex flex-col">
          <span className={`text-xs ${charCount >= MAX_CHARS ? 'text-destructive' : 'text-muted-foreground'}`}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground/60 hidden md:inline">
            Ctrl+Enter to translate
          </span>
        </div>
        <Button onClick={onTranslate} disabled={!canTranslate} size="sm">
          {isTranslating ? (
            <span className="animate-pulse">Translating...</span>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-1" />
              Translate
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
