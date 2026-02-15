import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-translation.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)] animated-gradient" />
      <div className="absolute inset-0 dot-pattern opacity-40" />

      <div className="section-container relative z-10 py-20 fade-in-up">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card hover-lift">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Free AI Translation Tools</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight">
              Translate Anything{" "}
              <span className="gradient-text">Instantly</span>
            </h1>

            <p className="text-xl text-foreground/80 leading-relaxed max-w-2xl font-medium">
              Translate text or subtitle files (SRT, VTT) to 50+ languages with
              blazing-fast AI precision. No signup required, completely free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/text-translate">
                <Button size="lg" variant="premium" className="text-lg font-bold">
                  Translate Text
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/subtitle-translate">
                <Button size="lg" variant="glass" className="text-lg font-semibold">
                  Translate Subtitles
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8">
              <div className="flex items-center gap-3 glass-card p-4 rounded-xl hover-lift">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm">
                  <div className="font-bold text-lg">Text & Files</div>
                  <div className="text-muted-foreground font-medium">Supported</div>
                </div>
              </div>
              <div className="flex items-center gap-3 glass-card p-4 rounded-xl hover-lift">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <div className="text-sm">
                  <div className="font-bold text-lg">50+</div>
                  <div className="text-muted-foreground font-medium">Languages</div>
                </div>
              </div>
              <div className="flex items-center gap-3 glass-card p-4 rounded-xl hover-lift">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm">
                  <div className="font-bold text-lg">AI-Powered</div>
                  <div className="text-muted-foreground font-medium">Translation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-premium)] hover-lift border-2 border-primary/10">
              <img
                src={heroImage}
                alt="Multi-language translation interface showing instant translation to multiple languages"
                className="w-full h-auto"
              />
            </div>
            {/* Decorative gradient orbs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
