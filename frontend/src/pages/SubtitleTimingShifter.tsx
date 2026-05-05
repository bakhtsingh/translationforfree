/**
 * Subtitle Timing Shifter Page
 * Pure client-side subtitle cue timing offset — no backend needed.
 * Targets the "subtitle out of sync" / "shift subtitle timing" search intent.
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Upload, Download, Copy, Check, FileText, X, Clock, RotateCcw, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
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
import { shiftCues } from '@/services/timingShifter';

const PREVIEW_CUE_COUNT = 5;
const MAX_FILE_SIZE_MB = 10;
const PRESETS = [-5, -1, -0.5, 0.5, 1, 5];

const SubtitleTimingShifter: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [format, setFormat] = useState<'srt' | 'vtt' | null>(null);
  const [cues, setCues] = useState<SubtitleCue[]>([]);
  const [offsetSeconds, setOffsetSeconds] = useState<number>(0);
  const [offsetInput, setOffsetInput] = useState<string>('0');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const reset = () => {
    setFileName(null);
    setFileSize(0);
    setFormat(null);
    setCues([]);
    setOffsetSeconds(0);
    setOffsetInput('0');
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
      setOffsetSeconds(0);
      setOffsetInput('0');
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

  const applyOffset = (value: number) => {
    setOffsetSeconds(value);
    setOffsetInput(value.toString());
  };

  const handleOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setOffsetInput(raw);
    const parsed = parseFloat(raw);
    setOffsetSeconds(isNaN(parsed) ? 0 : parsed);
  };

  const shiftResult = useMemo(() => {
    if (cues.length === 0) return null;
    return shiftCues(cues, offsetSeconds);
  }, [cues, offsetSeconds]);

  const download = () => {
    if (!shiftResult || !fileName || !format) return;
    const content = format === 'srt' ? formatToSRT(shiftResult.cues) : formatToVTT(shiftResult.cues);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const baseName = fileName.replace(/\.(srt|vtt)$/i, '');
    const downloadName = `${baseName}_shifted.${format}`;
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
    if (!shiftResult || !format) return;
    const content = format === 'srt' ? formatToSRT(shiftResult.cues) : formatToVTT(shiftResult.cues);
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: 'Could not copy to clipboard.', variant: 'destructive' });
    }
  };

  const duration = cues.length > 0 ? calculateTotalDuration(cues) : 0;
  const offsetLabel = offsetSeconds === 0
    ? 'No shift applied'
    : offsetSeconds > 0
      ? `Subtitles will appear ${formatOffsetSeconds(offsetSeconds)} later`
      : `Subtitles will appear ${formatOffsetSeconds(-offsetSeconds)} earlier`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Subtitle Timing Shifter — Fix Out-of-Sync Subtitles Free | TranslationForFree"
        description="Shift subtitle timing forward or backward by seconds or milliseconds. Fix out-of-sync SRT and VTT files free, no upload."
        path="/shift-subtitles"
        toolSchema={{
          name: 'Subtitle Timing Shifter',
          description: 'Shift all subtitle cues by ±N seconds with millisecond precision. Fixes out-of-sync SRT and VTT files.',
        }}
      />
      <Header />
      <main className="flex-1">
        <div className="section-container py-12 max-w-3xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Shift Subtitle Timing</h1>
            </div>
            <p className="text-muted-foreground">
              Fix out-of-sync subtitles by shifting all cues forward or backward. Works with SRT and VTT. Everything runs in your browser — your file never leaves your device.
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

          {/* File Info + Shift Controls */}
          {fileName && format && shiftResult && (
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

                <Badge variant="outline" className="uppercase">{format}</Badge>
              </Card>

              {/* Shift Controls */}
              <Card className="p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Shift offset</h2>
                  <p className="text-sm text-muted-foreground">
                    Use a negative value to shift subtitles earlier, positive to shift later.
                  </p>
                </div>

                {/* Preset Buttons */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Quick presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((p) => (
                      <Button
                        key={p}
                        variant={offsetSeconds === p ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => applyOffset(p)}
                      >
                        {p > 0 ? `+${p}s` : `${p}s`}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applyOffset(0)}
                      disabled={offsetSeconds === 0}
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Custom Input */}
                <div className="space-y-2">
                  <Label htmlFor="offset-input" className="text-xs uppercase tracking-wide text-muted-foreground">
                    Custom offset (seconds, decimals allowed)
                  </Label>
                  <Input
                    id="offset-input"
                    type="number"
                    step="0.001"
                    value={offsetInput}
                    onChange={handleOffsetChange}
                    placeholder="e.g. -2.5"
                    className="font-mono"
                  />
                </div>

                <div className="text-sm font-medium text-primary">
                  {offsetLabel}
                </div>

                {/* Warnings */}
                {(shiftResult.cuesDropped > 0 || shiftResult.cuesClamped > 0) && (
                  <div className="flex items-start gap-2 text-sm bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-md p-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      {shiftResult.cuesDropped > 0 && (
                        <p>
                          <span className="font-medium">{shiftResult.cuesDropped}</span> cue{shiftResult.cuesDropped === 1 ? '' : 's'} would start before 00:00:00 and will be dropped.
                        </p>
                      )}
                      {shiftResult.cuesClamped > 0 && (
                        <p>
                          <span className="font-medium">{shiftResult.cuesClamped}</span> cue{shiftResult.cuesClamped === 1 ? '' : 's'} will have their start time clamped to 00:00:00.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Card>

              {/* Before / After Preview */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Preview (first {Math.min(PREVIEW_CUE_COUNT, cues.length)} cues)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {shiftResult.cuesOut} cues in output
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-mono">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Before</p>
                    <div className="bg-muted/50 rounded-md p-3 space-y-2 max-h-64 overflow-y-auto">
                      {cues.slice(0, PREVIEW_CUE_COUNT).map((cue) => (
                        <div key={cue.id} className="border-b border-border/40 pb-2 last:border-0 last:pb-0">
                          <p className="text-xs text-muted-foreground">
                            {formatCueTime(cue.startTime)} → {formatCueTime(cue.endTime)}
                          </p>
                          <p className="truncate">{cue.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-primary mb-2">After</p>
                    <div className="bg-primary/5 rounded-md p-3 space-y-2 max-h-64 overflow-y-auto">
                      {shiftResult.cues.slice(0, PREVIEW_CUE_COUNT).map((cue) => (
                        <div key={cue.id} className="border-b border-border/40 pb-2 last:border-0 last:pb-0">
                          <p className="text-xs text-muted-foreground">
                            {formatCueTime(cue.startTime)} → {formatCueTime(cue.endTime)}
                          </p>
                          <p className="truncate">{cue.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Download */}
              <div className="flex gap-3">
                <Button
                  onClick={download}
                  className="flex-1"
                  size="lg"
                  disabled={offsetSeconds === 0 || shiftResult.cuesOut === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download shifted .{format}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={copyToClipboard}
                  disabled={offsetSeconds === 0 || shiftResult.cuesOut === 0}
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </>
          )}

          {/* Help / SEO Content */}
          <Card className="p-6 mt-6 bg-muted/30">
            <h2 className="text-lg font-semibold mb-3">When to shift subtitle timing</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Subtitles appear too late:</strong> use a negative offset to shift them earlier. If the subtitle line shows up 2 seconds after the dialogue, set offset to <code className="text-xs bg-muted px-1 py-0.5 rounded">-2</code>.
              </p>
              <p>
                <strong className="text-foreground">Subtitles appear too early:</strong> use a positive offset to delay them. If subtitles are 1.5 seconds ahead of the dialogue, set offset to <code className="text-xs bg-muted px-1 py-0.5 rounded">+1.5</code>.
              </p>
              <p>
                <strong className="text-foreground">Frame-rate mismatch:</strong> if the entire file drifts (gets worse over time), a constant offset won't fix it — that's a frame-rate problem, not a sync problem. This tool is for constant-offset issues only.
              </p>
              <p>
                <strong className="text-foreground">Privacy:</strong> the file is parsed and shifted entirely in your browser. Nothing is uploaded to any server.
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

function formatCueTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

function formatOffsetSeconds(seconds: number): string {
  if (seconds < 1) return `${Math.round(seconds * 1000)}ms`;
  if (seconds === Math.floor(seconds)) return `${seconds}s`;
  return `${seconds.toFixed(3)}s`;
}

export default SubtitleTimingShifter;
