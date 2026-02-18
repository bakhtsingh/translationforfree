/**
 * SRT ↔ VTT Converter Page
 * Pure client-side subtitle format conversion — no backend needed.
 * Uses existing parsers from subtitleParser.ts and file utilities from fileHandler.ts.
 */

import React, { useState, useCallback, useRef } from 'react';
import { Upload, Download, Copy, Check, FileText, ArrowRight, X, ArrowLeftRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SubtitleCue } from '@/types/subtitle';
import {
  parseSRT,
  parseVTT,
  formatToSRT,
  formatToVTT,
  detectFormat,
} from '@/services/subtitleParser';
import {
  readFileAsText,
  formatFileSize,
  calculateTotalDuration,
  formatDuration,
  validateFileSize,
  validateFileExtension,
} from '@/services/fileHandler';

const PREVIEW_CUE_COUNT = 5;
const MAX_FILE_SIZE_MB = 10;

const SubtitleConverter: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [sourceFormat, setSourceFormat] = useState<'srt' | 'vtt' | null>(null);
  const [cues, setCues] = useState<SubtitleCue[]>([]);
  const [convertedContent, setConvertedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const targetFormat = sourceFormat === 'srt' ? 'vtt' : 'srt';

  const reset = () => {
    setFileName(null);
    setFileSize(0);
    setSourceFormat(null);
    setCues([]);
    setConvertedContent(null);
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
      setSourceFormat(detected);
      setCues(parsed);
      setConvertedContent(null);
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

  const convert = () => {
    if (cues.length === 0 || !sourceFormat) return;
    const output = targetFormat === 'srt' ? formatToSRT(cues) : formatToVTT(cues);
    setConvertedContent(output);
  };

  const download = () => {
    if (!convertedContent || !fileName) return;
    const blob = new Blob([convertedContent], { type: 'text/plain;charset=utf-8' });
    const baseName = fileName.replace(/\.(srt|vtt)$/i, '');
    const downloadName = `${baseName}.${targetFormat}`;
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
    if (!convertedContent) return;
    try {
      await navigator.clipboard.writeText(convertedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: 'Could not copy to clipboard.', variant: 'destructive' });
    }
  };

  const duration = cues.length > 0 ? calculateTotalDuration(cues) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="section-container py-12 max-w-3xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <ArrowLeftRight className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">SRT ↔ VTT Converter</h1>
            </div>
            <p className="text-muted-foreground">
              Convert subtitle files between SRT and VTT formats instantly. No upload to any server — everything runs in your browser.
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

          {/* File Info + Actions */}
          {fileName && sourceFormat && (
            <>
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(fileSize)} · {cues.length} cues · {formatDuration(duration)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={reset} title="Remove file">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Conversion Direction */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="uppercase">{sourceFormat}</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="default" className="uppercase">{targetFormat}</Badge>
                </div>

                {/* Preview */}
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Preview (first {Math.min(PREVIEW_CUE_COUNT, cues.length)} cues)</p>
                  <div className="bg-muted/50 rounded-md p-3 text-sm font-mono space-y-2 max-h-48 overflow-y-auto">
                    {cues.slice(0, PREVIEW_CUE_COUNT).map((cue) => (
                      <div key={cue.id} className="border-b border-border/40 pb-2 last:border-0 last:pb-0">
                        <span className="text-muted-foreground">{cue.id}</span>
                        <p className="text-xs text-muted-foreground">
                          {formatCueTime(cue.startTime)} → {formatCueTime(cue.endTime)}
                        </p>
                        <p>{cue.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Convert Button */}
                {!convertedContent && (
                  <Button onClick={convert} className="w-full" size="lg">
                    Convert to {targetFormat.toUpperCase()}
                  </Button>
                )}

                {/* Download + Copy */}
                {convertedContent && (
                  <div className="flex gap-3">
                    <Button onClick={download} className="flex-1" size="lg">
                      <Download className="w-4 h-4 mr-2" />
                      Download .{targetFormat}
                    </Button>
                    <Button variant="outline" size="lg" onClick={copyToClipboard}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                )}
              </Card>

              {/* Converted Preview */}
              {convertedContent && (
                <Card className="p-6">
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Converted output (preview)</p>
                  <pre className="bg-muted/50 rounded-md p-3 text-sm font-mono max-h-64 overflow-y-auto whitespace-pre-wrap">
                    {convertedContent.slice(0, 2000)}
                    {convertedContent.length > 2000 && '\n... (truncated)'}
                  </pre>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

/** Format seconds to a readable timestamp for preview */
function formatCueTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

export default SubtitleConverter;
