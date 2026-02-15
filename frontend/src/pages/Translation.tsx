import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Globe, Loader2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const languages = [
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

const TranslationPage = () => {
  const [text, setText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!text.trim()) {
      toast({
        title: "Please enter text to translate",
        description: "The text field cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (sourceLanguage === targetLanguage) {
      toast({
        title: "Source and target languages are the same",
        description: "Please select different languages for translation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTranslatedText("");

    try {
      const response = await fetch("https://translationforfree-737270753447.us-south1.run.app/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          source_language: sourceLanguage,
          target_language: targetLanguage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTranslatedText(data.translated_text);
        toast({
          title: "Translation completed!",
          description: `Successfully translated from ${sourceLanguage} to ${targetLanguage}.`,
        });
      } else {
        throw new Error(data.error_message || "Translation failed");
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "The translated text has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    if (translatedText) {
      setText(translatedText);
      setTranslatedText("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="section-container py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12 fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card hover-lift mb-6">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Free Translation Tool</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-4">
            Translate Your Text{" "}
            <span className="gradient-text">Instantly</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fast, accurate translations powered by AI. No signup required, no data storage.
          </p>
        </div>

        {/* Translation Interface */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Input Section */}
            <Card className="glass-card hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Source Text
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">From:</label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source language" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Text to translate:</label>
                  <Textarea
                    placeholder="Enter your text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-32 resize-none"
                    maxLength={15000}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {text.length}/15,000 characters
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="glass-card hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent" />
                  Translated Text
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">To:</label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target language" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Translation:</label>
                  <div className="relative">
                    <Textarea
                      placeholder="Translation will appear here..."
                      value={translatedText}
                      readOnly
                      className="min-h-32 resize-none bg-muted/50"
                    />
                    {translatedText && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopy}
                        className="absolute top-2 right-2"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleSwapLanguages}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Swap Languages
            </Button>
            
            <Button
              onClick={handleTranslate}
              disabled={isLoading || !text.trim()}
              size="lg"
              variant="premium"
              className="text-lg font-bold px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Globe className="w-5 h-5 mr-2" />
                  Translate Now
                </>
              )}
            </Button>
          </div>

          {/* Features Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 glass-card rounded-xl hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">50+ Languages</h3>
              <p className="text-muted-foreground text-sm">Support for major world languages</p>
            </div>
            
            <div className="text-center p-6 glass-card rounded-xl hover-lift">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">15,000 Characters</h3>
              <p className="text-muted-foreground text-sm">Translate long documents and articles</p>
            </div>
            
            <div className="text-center p-6 glass-card rounded-xl hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Private & Secure</h3>
              <p className="text-muted-foreground text-sm">No data storage, completely private</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TranslationPage;
