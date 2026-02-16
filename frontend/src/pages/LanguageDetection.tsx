/**
 * Language Detection Page
 * Single-panel layout: textarea input on top, detected language result below.
 */

import React, { useState } from 'react';
import { Search, X, Copy, Check, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { detectLanguage } from '@/services/languageDetectionService';

const MAX_CHARS = 5000;

export default function LanguageDetection() {
  const [text, setText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleClear = () => {
    setText('');
    setDetectedLanguage(null);
    setConfidence(null);
  };

  const handleDetect = async () => {
    if (!text.trim()) {
      toast({
        title: 'No text entered',
        description: 'Please enter some text to detect the language',
        variant: 'destructive',
      });
      return;
    }

    setIsDetecting(true);
    setDetectedLanguage(null);
    setConfidence(null);

    try {
      const result = await detectLanguage({ text });

      if (result.success && result.detected_language) {
        setDetectedLanguage(result.detected_language);
        setConfidence(result.confidence);
      } else {
        throw new Error(result.error_message || 'Detection failed');
      }
    } catch (error) {
      toast({
        title: 'Detection failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleCopy = async () => {
    if (!detectedLanguage) return;
    await navigator.clipboard.writeText(detectedLanguage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTranslateThis = () => {
    navigate('/text-translate', {
      state: { text, sourceLanguage: detectedLanguage },
    });
  };

  const canDetect = text.trim().length > 0 && !isDetecting;
  const hasResult = detectedLanguage !== null;
  const confidencePercent = confidence !== null ? Math.round(confidence * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Compact Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Free Online <span className="gradient-text">Language Detector</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Paste any text and instantly detect its language. Powered by AI.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Input Card */}
          <Card className="p-4 flex flex-col">
            {/* Header: clear button */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Enter text</span>
              {text.length > 0 && (
                <Button variant="ghost" size="icon" onClick={handleClear} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Textarea */}
            <Textarea
              placeholder="Type or paste text here to detect its language..."
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canDetect) {
                  e.preventDefault();
                  handleDetect();
                }
              }}
              disabled={isDetecting}
              className="resize-none overflow-y-auto min-h-[180px]"
            />

            {/* Footer: char count + detect button */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-col">
                <span className={`text-xs ${text.length >= MAX_CHARS ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground/60 hidden md:inline">
                  Ctrl+Enter to detect
                </span>
              </div>
              <Button onClick={handleDetect} disabled={!canDetect} size="sm">
                {isDetecting ? (
                  <span className="animate-pulse">Detecting...</span>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-1" />
                    Detect Language
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Result Card */}
          {(isDetecting || hasResult) && (
            <Card className="p-6 bg-muted/30">
              {isDetecting ? (
                /* Skeleton loader */
                <div className="space-y-4 animate-pulse">
                  <div className="h-6 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ) : hasResult ? (
                <div className="space-y-4">
                  {/* Detected language */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Detected Language</p>
                      <p className="text-2xl font-bold">{detectedLanguage}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-2 text-xs">
                      {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>

                  {/* Confidence bar */}
                  {confidence !== null && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Confidence</span>
                        <span className="text-sm font-medium">{confidencePercent}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${confidencePercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Translate CTA */}
                  <Button onClick={handleTranslateThis} variant="outline" size="sm" className="mt-2">
                    Translate this text
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ) : null}
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
