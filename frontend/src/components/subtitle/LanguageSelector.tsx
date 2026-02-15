/**
 * Language Selector Component
 * Allows selection of source and target languages with swap functionality
 */

import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTranslation, useTranslationActions } from '../../contexts/TranslationContext';

// Same language list as existing translation page
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

export function LanguageSelector() {
  const { state } = useTranslation();
  const actions = useTranslationActions();

  const handleSourceLanguageChange = (language: string) => {
    actions.setSourceLanguage(language);
  };

  const handleTargetLanguageChange = (language: string) => {
    actions.setTargetLanguage(language);
  };

  const handleSwapLanguages = () => {
    actions.swapLanguages();
  };

  const isDisabled = !state.subtitleFile || state.isTranslating;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        {/* Source Language */}
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">
            From
          </label>
          <Select
            value={state.sourceLanguage}
            onValueChange={handleSourceLanguageChange}
            disabled={isDisabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select source language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Swap Button */}
        <div className="pt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwapLanguages}
            disabled={isDisabled}
            title="Swap languages"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Target Language */}
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">
            To
          </label>
          <Select
            value={state.targetLanguage}
            onValueChange={handleTargetLanguageChange}
            disabled={isDisabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select target language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
