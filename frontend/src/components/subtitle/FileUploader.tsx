/**
 * File Uploader Component
 * Drag-and-drop zone for subtitle file upload
 */

import React, { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { useTranslation, useTranslationActions } from '../../contexts/TranslationContext';
import {
  validateSubtitleFile,
  getErrorMessage,
} from '../../services/validationService';
import { readFileAsText, getFileFormat, formatFileSize } from '../../services/fileHandler';
import { parseSRT, parseVTT } from '../../services/subtitleParser';
import { calculateTotalDuration } from '../../services/fileHandler';

export function FileUploader() {
  const { state } = useTranslation();
  const actions = useTranslationActions();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    console.log('📁 File selected:', file.name);

    // Validate file
    const validation = validateSubtitleFile(file);
    if (!validation.valid) {
      const errorMessage = getErrorMessage(validation.errors);
      toast({
        title: 'Invalid file',
        description: errorMessage,
        variant: 'destructive',
      });
      return;
    }

    // Set uploading status
    actions.setStatus('parsing');
    actions.setUploadedFile(file);

    try {
      // Read file content
      const content = await readFileAsText(file);
      console.log('📖 File content read');

      // Detect format
      const format = getFileFormat(file.name);
      if (!format) {
        throw new Error('Unable to detect file format');
      }

      // Parse subtitle file
      let cues;
      if (format === 'srt') {
        cues = parseSRT(content);
      } else {
        cues = parseVTT(content);
      }

      console.log(`✅ Parsed ${cues.length} subtitle cues`);

      // Calculate duration
      const duration = calculateTotalDuration(cues);

      // Create subtitle file object
      const subtitleFile = {
        fileName: file.name,
        format,
        cues,
        metadata: {
          fileSize: file.size,
          totalCues: cues.length,
          duration,
        },
      };

      actions.setSubtitleFile(subtitleFile);
      actions.setStatus('idle');

      toast({
        title: 'File uploaded successfully',
        description: `${cues.length} subtitles loaded`,
      });
    } catch (error) {
      console.error('❌ File parsing failed:', error);
      actions.setError({
        message: error instanceof Error ? error.message : 'Failed to parse file',
        code: 'PARSE_ERROR',
      });

      toast({
        title: 'Failed to parse file',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  }, [actions, toast]);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Handle remove file
  const handleRemoveFile = useCallback(() => {
    actions.reset();
    toast({
      title: 'File removed',
      description: 'Upload a new file to continue',
    });
  }, [actions, toast]);

  // If file is uploaded, show file info
  if (state.uploadedFile && state.subtitleFile) {
    return (
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <File className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{state.subtitleFile.fileName}</h3>
              <div className="text-sm text-muted-foreground mt-1 space-y-1">
                <p>Format: {state.subtitleFile.format.toUpperCase()}</p>
                <p>Size: {formatFileSize(state.subtitleFile.metadata.fileSize)}</p>
                <p>Subtitles: {state.subtitleFile.metadata.totalCues} cues</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemoveFile}
            disabled={state.isTranslating}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  // Otherwise show upload zone
  return (
    <Card
      className={`p-8 border-2 border-dashed transition-colors ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50'
      } ${state.translationStatus === 'parsing' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="bg-primary/10 p-4 rounded-full">
          <Upload className="h-8 w-8 text-primary" />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            {state.translationStatus === 'parsing' ? 'Processing file...' : 'Upload Subtitle File'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your SRT or VTT file here, or click to browse
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            disabled={state.translationStatus === 'parsing'}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            Browse Files
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Maximum file size: 10MB • Supported formats: .srt, .vtt
        </p>
      </div>

      <input
        id="file-input"
        type="file"
        accept=".srt,.vtt"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={state.translationStatus === 'parsing'}
      />
    </Card>
  );
}
