/**
 * Subtitle to Text Extractor Page
 * Pure client-side extraction of dialogue text from SRT/VTT files — no backend needed.
 * Targets the "srt to txt" / "extract text from subtitles" search intent.
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Upload, Download, Copy, Check, FileText, X, FileType } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SubtitleCue } from '@/types/subtitle';
import { parseSRT, parseVTT, detectFormat } from '@/services/subtitleParser';
import {
  readFileAsText,
  formatFileSize,
  validateFileSize,
  validateFileExtension,
} from '@/services/fileHandler';
import { extractText, ExtractMode } from '@/services/txtExtractor';

const MAX_FILE_SIZE_MB = 10;
const PREVIEW_CHAR_LIMIT = 3000;

const MODES: Array<{ value: ExtractMode; label: string; helper: string }> = [
  { value: 'lines', label: 'One line per cue', helper: 'Preserves the original subtitle line breaks. Best for scripts.' },
  { value: 'paragraphs', label: 'Paragraphs', helper: 'Groups consecutive cues into paragraphs (3-second gap = new paragraph). Best for transcripts.' },
  { value: 'block', label: 'Single block', helper: 'Joins everything into one continuous paragraph. Best for AI summarization.' },
];

const SubtitleToText: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [format, setFormat] = useState<'srt' | 'vtt' | null>(null);
  const [cues, setCues] = useState<SubtitleCue[]>([]);
  const [mode, setMode] = useState<ExtractMode>('lines');
  const [stripTags, setStripTags] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const reset = () => {
    setFileName(null);
    setFileSize(0);
    setFormat(null);
    setCues([]);
    setMode('lines');
    setStripTags(true);
    setCopied(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processFile = useCallback(async (file: File) => {
    if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
      toast({ title: 'File too large', description: `Maximum size is ${MAX_FILE_SIZE_MB} MB.`, variant: 'destructive' });
      return;
    }
    if (!validateFileExtension(file.name, ['.srt', '.vtt'])) {
      toast({ title: 'Invalid file type', description: 'Please upload an .srt or .vtt file.', variant: 'destructive' });
      return;
    }

    try {
      const content = await readFileAsText(file);
      const detected = detectFormat(content);
      if (!detected) {
        toast({ title: 'Unrecognized format', description: 'Could not detect SRT or VTT format in this file.', variant: 'destructive' });
        return;
      }

      const parsed = detected === 'srt' ? parseSRT(content) : parseVTT(content);

      setFileName(file.name);
      setFileSize(file.size);
      setFormat(detected);
      setCues(parsed);
      setCopied(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to parse file.';
      toast({ title: 'Parse error', description: message, variant: 'destructive' });
    }
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const result = useMemo(() => {
    if (cues.length === 0) return null;
    return extractText(cues, { mode, stripTags });
  }, [cues, mode, stripTags]);

  const download = () => {
    if (!result || !fileName) return;
    const blob = new Blob([result.text], { type: 'text/plain;charset=utf-8' });
    const baseName = fileName.replace(/\.(srt|vtt)$/i, '');
    const downloadName = `${baseName}.txt`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: 'Could not copy to clipboard.', variant: 'destructive' });
    }
  };

  const previewText = result
    ? result.text.length > PREVIEW_CHAR_LIMIT
      ? result.text.slice(0, PREVIEW_CHAR_LIMIT) + '\n\n... (truncated for preview, download for full text)'
      : result.text
    : '';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="section-container py-12 max-w-3xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <FileType className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Extract Text from Subtitles</h1>
            </div>
            <p className="text-muted-foreground">
              Convert SRT or VTT to plain text. Strip timestamps, indices, and formatting tags. Output as lines, paragraphs, or a single block. Everything runs in your browser.
            </p>
          </div>

          {/* Upload Zone */}
          {!fileName && (
            <Card
              className={`border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Drop your .srt or .vtt file here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".srt,.vtt"
                className="hidden"
                onChange={handleFileChange}
              />
            </Card>
          )}

          {/* File Info + Controls */}
          {fileName && format && result && (
            <>
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(fileSize)} · {cues.length} cues
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={reset} title="Remove file">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="uppercase">{format}</Badge>
                  <Badge variant="default" className="uppercase">TXT</Badge>
                </div>
              </Card>

              {/* Mode Selector */}
              <Card className="p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Output format</h2>
                  <p className="text-sm text-muted-foreground">Pick how the dialogue should be structured.</p>
                </div>

                <div className="space-y-2">
                  {MODES.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMode(m.value)}
                      className={`w-full text-left rounded-md border p-3 transition-colors ${
                        mode === m.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/40'
                      }`}
                    >
                      <p className="font-medium text-sm">{m.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.helper}</p>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <div>
                    <Label htmlFor="strip-tags" className="text-sm font-medium">Strip formatting tags</Label>
                    <p className="text-xs text-muted-foreground">Removes &lt;i&gt;, &lt;b&gt;, &lt;font&gt;, and ASS override tags.</p>
                  </div>
                  <Switch
                    id="strip-tags"
                    checked={stripTags}
                    onCheckedChange={setStripTags}
                  />
                </div>
              </Card>

              {/* Stats */}
              <Card className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{result.wordCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Words</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{result.charCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Characters</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{result.lineCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Lines</p>
                  </div>
                </div>
              </Card>

              {/* Preview */}
              <Card className="p-6">
                <p className="text-sm font-medium mb-2 text-muted-foreground">Preview</p>
                <pre className="bg-muted/50 rounded-md p-4 text-sm font-mono max-h-96 overflow-y-auto whitespace-pre-wrap break-words">
                  {previewText || '(empty)'}
                </pre>
              </Card>

              {/* Download */}
              <div className="flex gap-3">
                <Button
                  onClick={download}
                  className="flex-1"
                  size="lg"
                  disabled={!result || result.charCount === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download .txt
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={copyToClipboard}
                  disabled={!result || result.charCount === 0}
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </>
          )}

          {/* Help / SEO Content */}
          <Card className="p-6 mt-6 bg-muted/30">
            <h2 className="text-lg font-semibold mb-3">When to extract text from subtitles</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Get a transcript:</strong> Pull the spoken dialogue out of any movie, show, or video subtitle file as plain text. Use the <em>Paragraphs</em> mode for the most readable output.
              </p>
              <p>
                <strong className="text-foreground">Feed to AI:</strong> Strip timestamps and pipe a clean transcript into ChatGPT, Claude, or Gemini for summarization, translation, or analysis. <em>Single block</em> mode gives the cleanest input.
              </p>
              <p>
                <strong className="text-foreground">Repurpose for blog or doc:</strong> Quote dialogue or use the transcript as content source. <em>One line per cue</em> mode preserves the original subtitle structure.
              </p>
              <p>
                <strong className="text-foreground">Privacy:</strong> The file is parsed and extracted entirely in your browser. Nothing is uploaded to any server.
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubtitleToText;
