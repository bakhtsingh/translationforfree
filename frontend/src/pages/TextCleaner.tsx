/**
 * Text Cleaner Page
 * Pure client-side text cleaning — strip whitespace, line breaks, page numbers,
 * footnote markers, timestamps, duplicate lines; fix encoding, normalize quotes.
 * Targets the "remove extra spaces", "remove line breaks", "clean text",
 * "prepare text for ChatGPT" search intent.
 */

import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Trash2, Wand2, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import {
  cleanText,
  CleanOptions,
  DEFAULT_OPTIONS,
  PRESETS,
  PresetKey,
} from '@/services/textCleaner';

interface OptionEntry {
  key: keyof CleanOptions;
  label: string;
  helper: string;
}

const OPTION_GROUPS: Array<{ title: string; items: OptionEntry[] }> = [
  {
    title: 'Whitespace',
    items: [
      { key: 'trimLines', label: 'Trim each line', helper: 'Remove leading and trailing whitespace from every line.' },
      { key: 'collapseSpaces', label: 'Collapse multiple spaces', helper: 'Replace runs of spaces or tabs with a single space.' },
      { key: 'removeEmptyLines', label: 'Remove all empty lines', helper: 'Drop lines that are blank or whitespace-only.' },
      { key: 'collapseBlankLines', label: 'Collapse blank lines', helper: 'Reduce 3+ blank lines down to one blank line.' },
      { key: 'removeAllLineBreaks', label: 'Remove all line breaks', helper: 'Join everything into one paragraph (use with care).' },
    ],
  },
  {
    title: 'Pattern removal',
    items: [
      { key: 'removePageNumbers', label: 'Remove page-number lines', helper: 'Drops lines like "12", "Page 12", "12 of 50", "- 12 -".' },
      { key: 'removeFootnoteMarkers', label: 'Remove footnote markers', helper: 'Strips [1], [2,3], and superscript digits.' },
      { key: 'removeTimestamps', label: 'Remove timestamps', helper: 'Strips 12:34 / 12:34:56 / [12:34] patterns inline.' },
      { key: 'removeUrls', label: 'Remove URLs', helper: 'Strips http://, https://, and www. URLs.' },
      { key: 'removeEmails', label: 'Remove email addresses', helper: 'Strips x@y.z patterns.' },
      { key: 'removeDuplicateLines', label: 'Remove consecutive duplicates', helper: 'Drops a line if identical to the line above it.' },
    ],
  },
  {
    title: 'Encoding & characters',
    items: [
      { key: 'fixEncoding', label: 'Fix encoding mojibake', helper: 'Replaces â€™ → ʼ, Ã© → é, BOM, non-breaking spaces.' },
      { key: 'normalizeSmartQuotes', label: 'Normalize smart quotes', helper: 'Curly “ ” ‘ ’ → straight " \'.' },
      { key: 'normalizeDashes', label: 'Normalize dashes', helper: 'Em (—), en (–), and figure dashes → hyphen (-).' },
      { key: 'removeNonAscii', label: 'Remove all non-ASCII', helper: 'Strips emoji, accented letters, CJK characters.' },
    ],
  },
];

const TextCleaner: React.FC = () => {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<CleanOptions>({ ...DEFAULT_OPTIONS });
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => cleanText(input, options), [input, options]);

  const toggleOption = (key: keyof CleanOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyPreset = (preset: PresetKey) => {
    setOptions({ ...DEFAULT_OPTIONS, ...PRESETS[preset].options });
  };

  const resetOptions = () => setOptions({ ...DEFAULT_OPTIONS });

  const clearInput = () => setInput('');

  const copy = async () => {
    if (!result.text) return;
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: 'Could not copy to clipboard.', variant: 'destructive' });
    }
  };

  const download = () => {
    if (!result.text) return;
    const blob = new Blob([result.text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const anyOptionEnabled = Object.values(options).some(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Text Cleaner — Remove Extra Spaces, Line Breaks, Page Numbers Free | TranslationForFree"
        description="Free online text cleaner. Remove extra spaces, line breaks, page numbers, footnote markers, timestamps, duplicate lines. Fix encoding mojibake. Prepare text for ChatGPT. No signup, runs in your browser."
        path="/clean-text"
        toolSchema={{
          name: 'Text Cleaner',
          description: 'Clean text by removing extra spaces, line breaks, page numbers, footnote markers, timestamps, and encoding artifacts. Useful for preparing copied PDF or OCR text for ChatGPT and other AI tools.',
        }}
      />
      <Header />
      <main className="flex-1">
        <div className="section-container py-12 max-w-4xl mx-auto space-y-6">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Wand2 className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Text Cleaner</h1>
            </div>
            <p className="text-muted-foreground">
              Strip extra spaces, line breaks, page numbers, footnote markers, timestamps, and encoding artifacts. Pick a preset or toggle individual cleaners. Everything runs in your browser.
            </p>
          </div>

          {/* Presets */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Presets</Label>
              {anyOptionEnabled && (
                <Button variant="ghost" size="sm" onClick={resetOptions}>
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Reset all
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(key)}
                  title={PRESETS[key].description}
                >
                  {PRESETS[key].label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Presets are starting points — toggle individual options below to fine-tune.
            </p>
          </Card>

          {/* Options */}
          <Card className="p-6 space-y-6">
            {OPTION_GROUPS.map((group) => (
              <div key={group.title} className="space-y-3">
                <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">{group.title}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {group.items.map((item) => (
                    <label
                      key={item.key}
                      htmlFor={`opt-${item.key}`}
                      className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors ${
                        options[item.key]
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/40'
                      }`}
                    >
                      <Checkbox
                        id={`opt-${item.key}`}
                        checked={options[item.key]}
                        onCheckedChange={() => toggleOption(item.key)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.helper}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </Card>

          {/* Input */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="input-text" className="text-sm font-semibold">
                Paste your text
              </Label>
              {input && (
                <Button variant="ghost" size="sm" onClick={clearInput}>
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            <textarea
              id="input-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste copied PDF text, OCR output, anything that needs cleaning…"
              className="w-full min-h-[180px] rounded-md border border-border bg-background p-3 text-sm font-mono outline-none focus:border-primary"
            />
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{result.before.charCount.toLocaleString()} chars</span>
              <span>·</span>
              <span>{result.before.wordCount.toLocaleString()} words</span>
              <span>·</span>
              <span>{result.before.lineCount.toLocaleString()} lines</span>
            </div>
          </Card>

          {/* Output */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Label className="text-sm font-semibold">Cleaned text</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copy}
                  disabled={!result.text}
                >
                  {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={download}
                  disabled={!result.text}
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Download .txt
                </Button>
              </div>
            </div>
            <textarea
              value={result.text}
              readOnly
              placeholder="Cleaned text will appear here as you toggle options…"
              className="w-full min-h-[180px] rounded-md border border-border bg-muted/30 p-3 text-sm font-mono outline-none"
            />
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Badge variant="outline">Before</Badge>
                {result.before.charCount.toLocaleString()} chars · {result.before.wordCount.toLocaleString()} words · {result.before.lineCount.toLocaleString()} lines
              </span>
              <span className="flex items-center gap-1.5">
                <Badge variant="default">After</Badge>
                {result.after.charCount.toLocaleString()} chars · {result.after.wordCount.toLocaleString()} words · {result.after.lineCount.toLocaleString()} lines
              </span>
            </div>
          </Card>

          {/* Help / SEO Content */}
          <Card className="p-6 mt-2 bg-muted/30">
            <h2 className="text-lg font-semibold mb-3">When to clean text</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Pasted from a PDF:</strong> PDFs love to leak page numbers, headers, footers, and stray spaces between letters. Use the <em>Clean OCR / PDF text</em> preset.
              </p>
              <p>
                <strong className="text-foreground">Preparing input for ChatGPT or Claude:</strong> Strip footnote markers and fix mojibake so the AI focuses on the actual content. Use the <em>Prepare for ChatGPT</em> preset.
              </p>
              <p>
                <strong className="text-foreground">Cleaning OCR output:</strong> OCR tools introduce double spaces, broken paragraphs, and stray markers. The pattern-removal toggles handle most of it.
              </p>
              <p>
                <strong className="text-foreground">Privacy:</strong> Everything happens in your browser. Your text is never uploaded to any server.
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TextCleaner;
