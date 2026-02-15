import { Globe, Languages, Zap, FileText, Users, Type } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import featureBulkImage from "@/assets/feature-bulk.jpg";
import featurePrivacyImage from "@/assets/feature-privacy.jpg";
import featureSpeedImage from "@/assets/feature-speed.jpg";

const features = [
  {
    icon: Type,
    title: "Instant Text Translation",
    description: "Paste Text, Get Translations",
    details: "Type or paste any text and translate it instantly to 50+ languages. Perfect for emails, messages, documents, or any text you need translated quickly. No file upload needed.",
    highlight: "The fastest way to translate text — paste, click, done.",
    image: featureBulkImage,
  },
  {
    icon: Globe,
    title: "Blazing-Fast AI Translation",
    description: "Powered by Advanced AI",
    details: "Our AI understands context and nuance, delivering professional-quality translations. Whether it's a paragraph of text or hundreds of subtitle cues, results arrive in seconds.",
    highlight: "Way faster than manual translation, more accurate than basic tools.",
    image: featureSpeedImage,
  },
  {
    icon: Languages,
    title: "Support for 50+ Languages",
    description: "Translate to Any Language You Need",
    details: "From English to Spanish, Chinese to Arabic, Japanese to French — we support all major languages. Perfect for content creators, students, professionals, and anyone going global.",
    highlight: "One tool for all your translation needs.",
    image: featurePrivacyImage,
  },
];

const additionalFeatures = [
  {
    icon: FileText,
    title: "Subtitle File Support",
    description: "Upload SRT or VTT subtitle files and translate them with AI. Timing and formatting are preserved perfectly.",
  },
  {
    icon: Zap,
    title: "No Signup Required",
    description: "Start translating immediately. No email, no password, no tracking. Just open the tool and translate.",
  },
  {
    icon: Users,
    title: "Free to Use",
    description: "Translate text and subtitles completely free. Premium features coming soon for power users and teams.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-[var(--gradient-subtle)] relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Why Choose <span className="gradient-text">Our Tools?</span>
          </h2>
          <p className="text-xl text-foreground/70 font-medium">
            The fastest way to translate text and subtitle files with AI-powered precision.
          </p>
        </div>

        {/* Main Features */}
        <div className="space-y-24 mb-24">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`grid md:grid-cols-2 gap-12 items-center`}
            >
              <div className={`space-y-6 ${index % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary shadow-lg hover-lift">
                  <feature.icon className="w-10 h-10" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold">{feature.title}</h3>
                <p className="text-xl font-bold text-primary">{feature.description}</p>
                <p className="text-lg text-foreground/70 leading-relaxed font-medium">
                  {feature.details}
                </p>
                <div className="p-5 rounded-2xl glass-card border-l-4 border-primary hover-lift">
                  <p className="font-semibold text-foreground">{feature.highlight}</p>
                </div>
              </div>
              <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-premium)] hover-lift border-2 border-primary/10">
                  <img
                    src={feature.image}
                    alt={`${feature.title} illustration`}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {additionalFeatures.map((feature) => (
            <Card key={feature.title} className="glass-card border-2 hover:border-primary/50 hover-lift">
              <CardContent className="p-8 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary shadow-lg">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-display font-bold">{feature.title}</h4>
                <p className="text-muted-foreground font-medium">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
