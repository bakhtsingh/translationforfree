/**
 * Translation Context
 * Central state management for subtitle translation
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  SubtitleCue,
  SubtitleFile,
  TranslationStatus,
  TranslationProgress,
  TranslationError,
} from '../types';

/**
 * Translation state interface
 */
interface TranslationState {
  // File upload
  uploadedFile: File | null;
  subtitleFile: SubtitleFile | null;

  // Translation
  sourceLanguage: string;
  targetLanguage: string;
  translationStatus: TranslationStatus;
  translationProgress: TranslationProgress | null;
  error: TranslationError | null;

  // UI state
  isTranslating: boolean;
  canDownload: boolean;
}

/**
 * Translation actions
 */
type TranslationAction =
  | { type: 'SET_UPLOADED_FILE'; payload: File }
  | { type: 'SET_SUBTITLE_FILE'; payload: SubtitleFile }
  | { type: 'SET_SOURCE_LANGUAGE'; payload: string }
  | { type: 'SET_TARGET_LANGUAGE'; payload: string }
  | { type: 'SET_STATUS'; payload: TranslationStatus }
  | { type: 'SET_PROGRESS'; payload: TranslationProgress }
  | { type: 'SET_ERROR'; payload: TranslationError }
  | { type: 'SET_TRANSLATING'; payload: boolean }
  | { type: 'UPDATE_TRANSLATED_CUES'; payload: SubtitleCue[] }
  | { type: 'UPDATE_CUE_TEXT'; payload: { cueId: string; text: string } }
  | { type: 'SWAP_LANGUAGES' }
  | { type: 'RESET' };

/**
 * Context value interface
 */
interface TranslationContextValue {
  state: TranslationState;
  dispatch: React.Dispatch<TranslationAction>;
}

// Create context
const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

// Initial state
const initialState: TranslationState = {
  uploadedFile: null,
  subtitleFile: null,
  sourceLanguage: 'English',
  targetLanguage: 'Spanish',
  translationStatus: 'idle',
  translationProgress: null,
  error: null,
  isTranslating: false,
  canDownload: false,
};

/**
 * Reducer function
 */
function translationReducer(state: TranslationState, action: TranslationAction): TranslationState {
  switch (action.type) {
    case 'SET_UPLOADED_FILE':
      return {
        ...state,
        uploadedFile: action.payload,
        translationStatus: 'idle',
        error: null,
      };

    case 'SET_SUBTITLE_FILE':
      return {
        ...state,
        subtitleFile: action.payload,
        translationStatus: 'idle',
        error: null,
      };

    case 'SET_SOURCE_LANGUAGE':
      return {
        ...state,
        sourceLanguage: action.payload,
      };

    case 'SET_TARGET_LANGUAGE':
      return {
        ...state,
        targetLanguage: action.payload,
      };

    case 'SET_STATUS':
      return {
        ...state,
        translationStatus: action.payload,
        isTranslating: action.payload === 'translating' || action.payload === 'parsing',
        canDownload: action.payload === 'completed',
        error: action.payload === 'error' ? state.error : null,
      };

    case 'SET_PROGRESS':
      return {
        ...state,
        translationProgress: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        translationStatus: 'error',
        isTranslating: false,
      };

    case 'SET_TRANSLATING':
      return {
        ...state,
        isTranslating: action.payload,
      };

    case 'UPDATE_TRANSLATED_CUES':
      if (!state.subtitleFile) return state;

      return {
        ...state,
        subtitleFile: {
          ...state.subtitleFile,
          cues: action.payload,
        },
        translationStatus: 'completed',
        isTranslating: false,
        canDownload: true,
      };

    case 'UPDATE_CUE_TEXT':
      if (!state.subtitleFile) return state;

      const updatedCues = state.subtitleFile.cues.map(cue =>
        cue.id === action.payload.cueId
          ? { ...cue, translatedText: action.payload.text }
          : cue
      );

      return {
        ...state,
        subtitleFile: {
          ...state.subtitleFile,
          cues: updatedCues,
        },
      };

    case 'SWAP_LANGUAGES':
      return {
        ...state,
        sourceLanguage: state.targetLanguage,
        targetLanguage: state.sourceLanguage,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

/**
 * Translation Provider Component
 */
export function TranslationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(translationReducer, initialState);

  const value: TranslationContextValue = {
    state,
    dispatch,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

/**
 * Hook to use translation context
 */
export function useTranslation() {
  const context = useContext(TranslationContext);

  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  return context;
}

/**
 * Helper hook with common actions
 */
export function useTranslationActions() {
  const { dispatch } = useTranslation();

  return {
    setUploadedFile: (file: File) => dispatch({ type: 'SET_UPLOADED_FILE', payload: file }),
    setSubtitleFile: (file: SubtitleFile) => dispatch({ type: 'SET_SUBTITLE_FILE', payload: file }),
    setSourceLanguage: (lang: string) => dispatch({ type: 'SET_SOURCE_LANGUAGE', payload: lang }),
    setTargetLanguage: (lang: string) => dispatch({ type: 'SET_TARGET_LANGUAGE', payload: lang }),
    setStatus: (status: TranslationStatus) => dispatch({ type: 'SET_STATUS', payload: status }),
    setProgress: (progress: TranslationProgress) => dispatch({ type: 'SET_PROGRESS', payload: progress }),
    setError: (error: TranslationError) => dispatch({ type: 'SET_ERROR', payload: error }),
    updateTranslatedCues: (cues: SubtitleCue[]) => dispatch({ type: 'UPDATE_TRANSLATED_CUES', payload: cues }),
    updateCueText: (cueId: string, text: string) => dispatch({ type: 'UPDATE_CUE_TEXT', payload: { cueId, text } }),
    swapLanguages: () => dispatch({ type: 'SWAP_LANGUAGES' }),
    reset: () => dispatch({ type: 'RESET' }),
  };
}
