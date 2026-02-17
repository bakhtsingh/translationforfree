/**
 * Transliteration Page
 * Convert text between writing systems (e.g., Hindi → Roman, Arabic → Roman, Japanese → Romaji).
 * Uses Gemini via the backend /transliterate endpoint.
 */

import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check, X, ArrowRight, Type } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { transliterateText } from '@/services/transliterationService';

const MAX_CHARS = 5000;

/**
 * Script options grouped by writing system category.
 * "Auto-detect" lets Gemini figure out the source script.
 * "English (Latin/Roman)" is the universal romanization target.
 */
const SCRIPTS = [
  // Latin / Roman
  "English (Latin/Roman)",
  // South Asian
  "Devanagari (Hindi/Sanskrit/Marathi)",
  "Bengali",
  "Gujarati",
  "Gurmukhi (Punjabi)",
  "Kannada",
  "Malayalam",
  "Odia",
  "Sinhala",
  "Tamil",
  "Telugu",
  // East Asian
  "Chinese (Pinyin)",
  "Japanese (Romaji)",
  "Japanese (Hiragana)",
  "Japanese (Katakana)",
  "Korean (Revised Romanization)",
  // Middle Eastern
  "Arabic",
  "Hebrew",
  "Persian (Farsi)",
  // Cyrillic
  "Cyrillic (Russian)",
  "Cyrillic (Ukrainian)",
  "Cyrillic (Serbian)",
  "Cyrillic (Bulgarian)",
  // Southeast Asian
  "Thai",
  "Khmer",
  "Myanmar (Burmese)",
  "Lao",
  // Other
  "Greek",
  "Georgian",
  "Armenian",
  "Tibetan",
  "Ethiopic (Amharic/Tigrinya)",
];

/** Popular presets shown as quick-pick chips */
const PRESETS: { label: string; source: string; target: string }[] = [
  { label: "Hindi → Roman", source: "Devanagari (Hindi/Sanskrit/Marathi)", target: "English (Latin/Roman)" },
  { label: "Arabic → Roman", source: "Arabic", target: "English (Latin/Roman)" },
  { label: "Japanese → Romaji", source: "Auto-detect", target: "Japanese (Romaji)" },
  { label: "Chinese → Pinyin", source: "Auto-detect", target: "Chinese (Pinyin)" },
  { label: "Russian → Roman", source: "Cyrillic (Russian)", target: "English (Latin/Roman)" },
  { label: "Korean → Roman", source: "Auto-detect", target: "Korean (Revised Romanization)" },
  { label: "Greek → Roman", source: "Greek", target: "English (Latin/Roman)" },
  { label: "Thai → Roman", source: "Thai", target: "English (Latin/Roman)" },
];

export default function Transliteration() {
  const [sourceText, setSourceText] = useState('');
  const [sourceScript, setSourceScript] = useState('Auto-detect');
  const [targetScript, setTargetScript] = useState('English (Latin/Roman)');
  const [result, setResult] = useState<string | null>(null);
  const [detectedScript, setDetectedScript] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleClear = () => {
    setSourceText('');
    setResult(null);
    setDetectedScript(null);
  };

  const handleSwapScripts = () => {
    if (sourceScript === 'Auto-detect') return;
    const prev = sourceScript;
    setSourceScript(targetScript);
    setTargetScript(prev);
    // If we have a result, swap the texts
    if (result) {
      setSourceText(result);
      setResult(null);
      setDetectedScript(null);
    }
  };

  const handlePreset = (preset: { source: string; target: string }) => {
    setSourceScript(preset.source);
    setTargetScript(preset.target);
  };

  const handleTransliterate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: 'No text entered',
        description: 'Please enter some text to transliterate',
        variant: 'destructive',
      });
      return;
    }

    if (sourceScript !== 'Auto-detect' && sourceScript === targetScript) {
      toast({
        title: 'Same script selected',
        description: 'Source and target scripts must be different',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setDetectedScript(null);

    try {
      const response = await transliterateText({
        text: sourceText,
        sourceScript,
        targetScript,
      });

      if (response.success && response.transliterated_text) {
        setResult(response.transliterated_text);
        setDetectedScript(response.source_script || null);
      } else {
        throw new Error(response.error_message || 'Transliteration failed');
      }
    } catch (error) {
      toast({
        title: 'Transliteration failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTranslateResult = () => {
    if (!result) return;
    navigate('/text-translate', { state: { text: result } });
  };

  const canProcess = sourceText.trim().length > 0 && !isProcessing;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Compact Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Free <span className="gradient-text">Transliteration Tool</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Convert text between writing systems — Hindi to Roman, Arabic to Roman, Japanese to Romaji, and more. Powered by AI.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 justify-center">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset)}
                disabled={isProcessing}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all
                  ${sourceScript === preset.source && targetScript === preset.target
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Input Card */}
          <Card className="p-4 flex flex-col">
            {/* Header: script selectors + swap + clear */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">From:</label>
                <select
                  value={sourceScript}
                  onChange={(e) => setSourceScript(e.target.value)}
                  disabled={isProcessing}
                  className="text-sm border rounded-md px-2 py-1 bg-background max-w-[200px]"
                >
                  <option value="Auto-detect">Auto-detect</option>
                  {SCRIPTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSwapScripts}
                disabled={isProcessing || sourceScript === 'Auto-detect'}
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                title="Swap scripts"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">To:</label>
                <select
                  value={targetScript}
                  onChange={(e) => setTargetScript(e.target.value)}
                  disabled={isProcessing}
                  className="text-sm border rounded-md px-2 py-1 bg-background max-w-[200px]"
                >
                  {SCRIPTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1" />
              {sourceText.length > 0 && (
                <Button variant="ghost" size="icon" onClick={handleClear} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Textarea */}
            <Textarea
              placeholder="Type or paste text here to transliterate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canProcess) {
                  e.preventDefault();
                  handleTransliterate();
                }
              }}
              disabled={isProcessing}
              className="resize-none overflow-y-auto min-h-[150px]"
            />

            {/* Footer: char count + transliterate button */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-col">
                <span className={`text-xs ${sourceText.length >= MAX_CHARS ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {sourceText.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground/60 hidden md:inline">
                  Ctrl+Enter to transliterate
                </span>
              </div>
              <Button onClick={handleTransliterate} disabled={!canProcess} size="sm">
                {isProcessing ? (
                  <span className="animate-pulse">Transliterating...</span>
                ) : (
                  <>
                    <Type className="h-4 w-4 mr-1" />
                    Transliterate
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Result Card */}
          {(isProcessing || result !== null) && (
            <Card className="p-4 bg-muted/30">
              {isProcessing ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-5 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-4/5" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ) : result !== null ? (
                <div className="space-y-4">
                  {/* Header with detected script + copy */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-primary">{targetScript}</h3>
                      {detectedScript && sourceScript === 'Auto-detect' && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          Detected: {detectedScript}
                        </span>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-xs">
                      {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>

                  {/* Transliterated text */}
                  <p className="text-base leading-relaxed whitespace-pre-wrap select-all">
                    {result}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTranslateResult}
                      className="h-7 text-xs"
                    >
                      Translate this text
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                    {sourceScript === 'Auto-detect' && detectedScript && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSwapScripts}
                        disabled={!detectedScript}
                        className="h-7 text-xs text-muted-foreground"
                      >
                        <ArrowLeftRight className="h-3 w-3 mr-1" />
                        Reverse
                      </Button>
                    )}
                  </div>
                </div>
              ) : null}
            </Card>
          )}

          {/* SEO Content / How It Works */}
          <section className="mt-12 space-y-6 text-sm text-muted-foreground">
            <h2 className="text-xl font-bold text-foreground">What is Transliteration?</h2>
            <p>
              Transliteration converts text from one writing system to another while preserving the
              original pronunciation — unlike translation, which converts the meaning. For example,
              the Hindi word <strong>"नमस्ते"</strong> becomes <strong>"Namaste"</strong> in Latin
              script, keeping the sound identical.
            </p>

            <h2 className="text-xl font-bold text-foreground">Supported Scripts</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">South Asian</h3>
                <p>Devanagari (Hindi, Sanskrit, Marathi), Bengali, Gujarati, Gurmukhi (Punjabi), Kannada, Malayalam, Tamil, Telugu, Odia, Sinhala</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">East Asian</h3>
                <p>Chinese (Pinyin), Japanese (Romaji, Hiragana, Katakana), Korean (Revised Romanization)</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Middle Eastern</h3>
                <p>Arabic, Hebrew, Persian (Farsi)</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">European &amp; Other</h3>
                <p>Cyrillic (Russian, Ukrainian, Serbian, Bulgarian), Greek, Georgian, Armenian, Tibetan, Ethiopic</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-foreground">Common Uses</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Romanizing names for passports, forms, and official documents</li>
              <li>Learning pronunciation of foreign scripts</li>
              <li>Typing in your language using a Latin keyboard</li>
              <li>Converting song lyrics between scripts</li>
              <li>SEO — creating URL slugs from non-Latin text</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
