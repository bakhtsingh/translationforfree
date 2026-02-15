import { Type, Languages, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Type,
    title: "Enter or Upload Your Content",
    description: "Paste text directly into our Text Translator, or upload your SRT/VTT subtitle file. No signup needed.",
  },
  {
    number: "02",
    icon: Languages,
    title: "Select Languages & Translate",
    description: "Choose your source and target languages from 50+ options. Click translate and get results in seconds.",
  },
  {
    number: "03",
    icon: Download,
    title: "Copy or Download Results",
    description: "Copy your translated text, download it as a file, or download your translated subtitles with timing preserved.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Paste, translate, done. It's that simple.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="relative space-y-6 p-8 rounded-2xl bg-card hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl font-bold shadow-lg">
                  {step.number}
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <step.icon className="w-6 h-6 text-primary" />
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
