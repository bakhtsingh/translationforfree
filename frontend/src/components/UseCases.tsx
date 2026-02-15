import { GraduationCap, Briefcase, Plane, Code, PenTool, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const useCases = [
  {
    icon: PenTool,
    title: "Content Creators",
    description: "Translate subtitles for your YouTube, TikTok, or course videos to reach a global audience.",
  },
  {
    icon: Briefcase,
    title: "Professionals",
    description: "Quickly translate emails, messages, and short documents between languages.",
  },
  {
    icon: GraduationCap,
    title: "Students",
    description: "Translate text passages and foreign-language study materials for free.",
  },
  {
    icon: Globe,
    title: "Video Editors",
    description: "Batch-translate SRT and VTT subtitle files while preserving timing and formatting.",
  },
  {
    icon: Code,
    title: "Developers",
    description: "Translate UI strings and documentation text quickly and accurately.",
  },
  {
    icon: Plane,
    title: "Travelers",
    description: "Translate phrases and text snippets into any of 50+ supported languages.",
  },
];

const UseCases = () => {
  return (
    <section className="py-24">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built For <span className="gradient-text">Everyone</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Whether you're a student, creator, or professional — we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase) => (
            <Card key={useCase.title} className="group hover:border-primary/50 hover:shadow-lg transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <useCase.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">{useCase.title}</h3>
                <p className="text-muted-foreground">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
