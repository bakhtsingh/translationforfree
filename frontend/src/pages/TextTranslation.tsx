/**
 * Text Translation Page
 * Side-by-side translator layout inspired by Google Translate / DeepL
 */

import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TextInput } from '@/components/text/TextInput';
import { TextResult } from '@/components/text/TextResult';
import { translateText } from '@/services/textService';

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

export default function TextTranslation() {
  const location = useLocation();
  const navState = location.state as { text?: string; sourceLanguage?: string } | null;

  const [sourceText, setSourceText] = useState(navState?.text || '');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState(navState?.sourceLanguage || 'Auto-detect');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleSwapLanguages = () => {
    if (sourceLanguage === 'Auto-detect') return;
    const prevSource = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(prevSource);
    // Also swap the text contents
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: 'No text entered',
        description: 'Please enter some text to translate',
        variant: 'destructive',
      });
      return;
    }

    if (sourceLanguage !== 'Auto-detect' && sourceLanguage === targetLanguage) {
      toast({
        title: 'Same language selected',
        description: 'Source and target languages must be different',
        variant: 'destructive',
      });
      return;
    }

    setIsTranslating(true);
    setTranslatedText('');

    try {
      const result = await translateText({
        text: sourceText,
        sourceLanguage,
        targetLanguage,
      });

      if (result.success && result.translated_text) {
        setTranslatedText(result.translated_text);
      } else {
        throw new Error(result.error_message || 'Translation failed');
      }
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

  const canTranslate = sourceText.trim().length > 0 && !isTranslating;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Compact Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Free Online <span className="gradient-text">Text Translator</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            AI-powered translation for 50+ languages. No signup required.
          </p>
        </div>
      </section>

      {/* Main Content — side-by-side on desktop, stacked on mobile */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-0 md:gap-2 items-start">
            {/* Source panel */}
            <TextInput
              value={sourceText}
              onChange={setSourceText}
              onClear={handleClear}
              onTranslate={handleTranslate}
              sourceLanguage={sourceLanguage}
              onLanguageChange={setSourceLanguage}
              languages={LANGUAGES}
              isTranslating={isTranslating}
              canTranslate={canTranslate}
            />

            {/* Swap button — between panels */}
            <div className="flex justify-center items-center py-2 md:py-0 md:pt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapLanguages}
                disabled={isTranslating || sourceLanguage === 'Auto-detect'}
                title="Swap languages"
                className="rounded-full h-10 w-10"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Result panel */}
            <TextResult
              translatedText={translatedText}
              isTranslating={isTranslating}
              targetLanguage={targetLanguage}
              onLanguageChange={setTargetLanguage}
              languages={LANGUAGES}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
