import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-32 bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8 fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Ready to Go Global?
          </h2>
          <p className="text-2xl font-medium opacity-95">
            Translate text and subtitles in seconds. No signup required. Start free today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/text-translate">
              <Button
                size="lg"
                variant="glass"
                className="text-lg font-bold px-10 py-7 text-white border-white/30 hover:bg-white/30 hover:border-white/50 shadow-2xl"
              >
                Translate Text
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <Link to="/subtitle-translate">
              <Button
                size="lg"
                variant="glass"
                className="text-lg font-bold px-10 py-7 text-white border-white/30 hover:bg-white/30 hover:border-white/50 shadow-2xl"
              >
                Translate Subtitles
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
