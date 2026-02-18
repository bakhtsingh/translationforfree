import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";
import Index from "./pages/Index";
import SubtitleTranslation from "./pages/SubtitleTranslation";
import TextTranslation from "./pages/TextTranslation";
import LanguageDetection from "./pages/LanguageDetection";
import TranslationComparison from "./pages/TranslationComparison";
import Transliteration from "./pages/Transliteration";
import SubtitleConverter from "./pages/SubtitleConverter";
import NotFound from "./pages/NotFound";
import PageViewTracker from "./components/PageViewTracker";

const queryClient = new QueryClient();

const App = () => {
  // Initialize Google Analytics on component mount
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    if (measurementId) {
      ReactGA.initialize(measurementId);
      console.log('GA4 initialized with ID:', measurementId);
    } else {
      console.warn('GA4 Measurement ID not found');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageViewTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/subtitle-translate" element={<SubtitleTranslation />} />
            <Route path="/text-translate" element={<TextTranslation />} />
            <Route path="/detect-language" element={<LanguageDetection />} />
            <Route path="/compare-translations" element={<TranslationComparison />} />
            <Route path="/transliterate" element={<Transliteration />} />
            <Route path="/subtitle-converter" element={<SubtitleConverter />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
