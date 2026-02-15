/**
 * Subtitle Translation Page
 * Main page for uploading and translating SRT/VTT subtitle files
 */

import React from 'react';
import { Languages, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileUploader } from '@/components/subtitle/FileUploader';
import { LanguageSelector } from '@/components/subtitle/LanguageSelector';
import { SubtitleEditor } from '@/components/subtitle/SubtitleEditor';
import { TranslationProgress } from '@/components/subtitle/TranslationProgress';
import { DownloadButton } from '@/components/subtitle/DownloadButton';
import { TranslationProvider, useTranslation, useTranslationActions } from '@/contexts/TranslationContext';
import { translateSubtitles, estimateTranslationTime } from '@/services/geminiService';
import { validateTranslationRequest, getErrorMessage } from '@/services/validationService';

function SubtitleTranslationContent() {
  const { state } = useTranslation();
  const actions = useTranslationActions();
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!state.subtitleFile) {
      toast({
        title: 'No file uploaded',
        description: 'Please upload a subtitle file first',
        variant: 'destructive',
      });
      return;
    }

    // Validate translation request
    const validation = validateTranslationRequest(
      state.sourceLanguage,
      state.targetLanguage,
      state.subtitleFile.cues
    );

    if (!validation.valid) {
      const errorMessage = getErrorMessage(validation.errors);
      toast({
        title: 'Validation failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return;
    }

    // Start translation
    console.log(`🚀 Starting translation: ${state.sourceLanguage} → ${state.targetLanguage}`);
    actions.setStatus('translating');

    // Estimate time
    const estimatedSeconds = estimateTranslationTime(state.subtitleFile.cues.length);
    console.log(`⏱️  Estimated time: ~${estimatedSeconds} seconds`);

    try {
      const result = await translateSubtitles(
        {
          cues: state.subtitleFile.cues,
          sourceLanguage: state.sourceLanguage,
          targetLanguage: state.targetLanguage,
        },
        (progress) => {
          actions.setProgress(progress);
        }
      );

      if (result.success) {
        actions.updateTranslatedCues(result.translatedCues);
        toast({
          title: 'Translation completed!',
          description: `Successfully translated ${result.translatedCues.length} subtitles`,
        });
      } else {
        throw new Error(result.error?.message || 'Translation failed');
      }
    } catch (error) {
      console.error('❌ Translation error:', error);
      actions.setError({
        message: error instanceof Error ? error.message : 'Translation failed',
        code: 'TRANSLATION_ERROR',
      });

      toast({
        title: 'Translation failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const canTranslate = state.subtitleFile && !state.isTranslating && state.translationStatus !== 'completed';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Languages className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Translate Your <span className="gradient-text">Subtitles</span> Instantly
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your SRT or VTT subtitle files and translate them to 50+ languages with AI-powered precision
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Upload & Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* File Upload */}
              <FileUploader />

              {/* Language Selection */}
              {state.subtitleFile && (
                <>
                  <LanguageSelector />

                  {/* Translate Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleTranslate}
                      disabled={!canTranslate}
                      size="lg"
                      className="px-8"
                    >
                      {state.isTranslating ? (
                        <>
                          <span className="animate-pulse">Translating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Translate Now
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}

              {/* Subtitle Editor */}
              <SubtitleEditor />
            </div>

            {/* Right Column - Progress & Download */}
            <div className="space-y-6">
              <TranslationProgress />
              <DownloadButton />

              {/* Info Card */}
              {!state.subtitleFile && (
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">How it works</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="font-semibold text-primary mr-2">1.</span>
                      Upload your SRT or VTT subtitle file
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-primary mr-2">2.</span>
                      Select source and target languages
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-primary mr-2">3.</span>
                      Click translate and wait for AI magic
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-primary mr-2">4.</span>
                      Download your translated subtitles
                    </li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Wrap with provider
export default function SubtitleTranslation() {
  return (
    <TranslationProvider>
      <SubtitleTranslationContent />
    </TranslationProvider>
  );
}
