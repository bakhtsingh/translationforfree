/**
 * Translation Comparison Page
 * Translate the same text into 2-3 languages side-by-side.
 * Reuses the existing /translate/text backend endpoint (called in parallel).
 */

import React, { useState } from 'react';
import { Plus, X, Copy, Check, ArrowRight, GitCompareArrows } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { translateText } from '@/services/textService';

const MAX_CHARS = 5000;

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian",
  "Chinese", "Japanese", "Korean", "Arabic", "Hindi", "Telugu", "Tamil",
  "Bengali", "Gujarati", "Marathi", "Kannada", "Malayalam", "Punjabi",
  "Urdu", "Turkish", "Dutch", "Swedish", "Norwegian", "Danish", "Finnish",
  "Polish", "Czech", "Hungarian", "Romanian", "Bulgarian", "Croatian",
  "Serbian", "Slovak", "Slovenian", "Greek", "Hebrew", "Thai", "Vietnamese",
  "Indonesian", "Malay", "Filipino", "Ukrainian", "Belarusian", "Lithuanian",
  "Latvian", "Estonian", "Icelandic", "Maltese", "Georgian", "Armenian",
  "Azerbaijani", "Kazakh", "Kyrgyz", "Tajik", "Turkmen", "Uzbek", "Mongolian"
];

interface ComparisonResult {
  language: string;
  text: string;
}

export default function TranslationComparison() {
  const [sourceText, setSourceText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('Auto-detect');
  const [targetLanguages, setTargetLanguages] = useState<string[]>(['Spanish', 'French']);
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleClear = () => {
    setSourceText('');
    setResults([]);
  };

  const handleAddLanguage = () => {
    if (targetLanguages.length >= 3) return;
    // Pick the first language not already selected and not the source
    const used = new Set([sourceLanguage, ...targetLanguages]);
    const next = LANGUAGES.find((l) => !used.has(l)) || 'German';
    setTargetLanguages([...targetLanguages, next]);
  };

  const handleRemoveLanguage = (index: number) => {
    if (targetLanguages.length <= 2) return;
    setTargetLanguages(targetLanguages.filter((_, i) => i !== index));
    // Also remove corresponding result if it exists
    if (results.length > index) {
      setResults(results.filter((_, i) => i !== index));
    }
  };

  const handleTargetLanguageChange = (index: number, value: string) => {
    const updated = [...targetLanguages];
    updated[index] = value;
    setTargetLanguages(updated);
  };

  const handleCompare = async () => {
    if (!sourceText.trim()) {
      toast({
        title: 'No text entered',
        description: 'Please enter some text to compare translations',
        variant: 'destructive',
      });
      return;
    }

    // Check for duplicate target languages
    const uniqueTargets = new Set(targetLanguages);
    if (uniqueTargets.size !== targetLanguages.length) {
      toast({
        title: 'Duplicate languages',
        description: 'Each target language must be different',
        variant: 'destructive',
      });
      return;
    }

    // Check if any target matches source (when not auto-detect)
    if (sourceLanguage !== 'Auto-detect') {
      const conflicting = targetLanguages.find((l) => l === sourceLanguage);
      if (conflicting) {
        toast({
          title: 'Same language selected',
          description: `"${conflicting}" is already the source language`,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsTranslating(true);
    setResults([]);

    try {
      const promises = targetLanguages.map((lang) =>
        translateText({
          text: sourceText,
          sourceLanguage,
          targetLanguage: lang,
        })
      );

      const responses = await Promise.all(promises);

      const newResults: ComparisonResult[] = [];
      for (let i = 0; i < responses.length; i++) {
        const res = responses[i];
        if (res.success && res.translated_text) {
          newResults.push({ language: targetLanguages[i], text: res.translated_text });
        } else {
          newResults.push({ language: targetLanguages[i], text: `Error: ${res.error_message || 'Translation failed'}` });
        }
      }

      setResults(newResults);
    } catch (error) {
      toast({
        title: 'Translation failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = async (index: number) => {
    if (!results[index]) return;
    await navigator.clipboard.writeText(results[index].text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleTranslateThis = (result: ComparisonResult) => {
    navigate('/text-translate', {
      state: { text: sourceText, sourceLanguage: sourceLanguage === 'Auto-detect' ? result.language : sourceLanguage },
    });
  };

  const canCompare = sourceText.trim().length > 0 && !isTranslating;

  const gridCols = results.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Compact Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Free <span className="gradient-text">Translation Comparison</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Compare translations side-by-side in up to 3 languages. Powered by AI.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Input Card */}
          <Card className="p-4 flex flex-col">
            {/* Header: source language + clear */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">From:</label>
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  disabled={isTranslating}
                  className="text-sm border rounded-md px-2 py-1 bg-background"
                >
                  <option value="Auto-detect">Auto-detect</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              {sourceText.length > 0 && (
                <Button variant="ghost" size="icon" onClick={handleClear} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Textarea */}
            <Textarea
              placeholder="Type or paste text here to compare translations..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canCompare) {
                  e.preventDefault();
                  handleCompare();
                }
              }}
              disabled={isTranslating}
              className="resize-none overflow-y-auto min-h-[150px]"
            />

            {/* Footer: char count + target languages + compare button */}
            <div className="mt-4 space-y-3">
              {/* Target languages */}
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">To:</label>
                {targetLanguages.map((lang, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <select
                      value={lang}
                      onChange={(e) => handleTargetLanguageChange(index, e.target.value)}
                      disabled={isTranslating}
                      className="text-sm border rounded-md px-2 py-1 bg-background"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                    {targetLanguages.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLanguage(index)}
                        disabled={isTranslating}
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                {targetLanguages.length < 3 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddLanguage}
                    disabled={isTranslating}
                    className="h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add language
                  </Button>
                )}
              </div>

              {/* Char count + compare button */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className={`text-xs ${sourceText.length >= MAX_CHARS ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {sourceText.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground/60 hidden md:inline">
                    Ctrl+Enter to compare
                  </span>
                </div>
                <Button onClick={handleCompare} disabled={!canCompare} size="sm">
                  {isTranslating ? (
                    <span className="animate-pulse">Comparing...</span>
                  ) : (
                    <>
                      <GitCompareArrows className="h-4 w-4 mr-1" />
                      Compare
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Results */}
          {(isTranslating || results.length > 0) && (
            <div className={`grid gap-4 ${isTranslating ? (targetLanguages.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2') : gridCols}`}>
              {isTranslating
                ? targetLanguages.map((lang, i) => (
                    <Card key={i} className="p-4 bg-muted/30">
                      <div className="space-y-3 animate-pulse">
                        <div className="h-5 bg-muted rounded w-1/3" />
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-4/5" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">{lang}</p>
                    </Card>
                  ))
                : results.map((result, i) => (
                    <Card key={i} className="p-4 bg-muted/30 flex flex-col">
                      {/* Language header */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-primary">{result.language}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(i)}
                          className="h-7 px-2 text-xs"
                        >
                          {copiedIndex === i ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                          {copiedIndex === i ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>

                      {/* Translated text */}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1">
                        {result.text}
                      </p>

                      {/* Translate this link */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTranslateThis(result)}
                        className="mt-3 self-start h-7 text-xs text-muted-foreground hover:text-primary"
                      >
                        Open in translator
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Card>
                  ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
