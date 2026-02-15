/**
 * Testimonials Component
 * Shows user testimonials from the design
 */

import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Video Editor",
    content: "This tool saved me hours of work! I was manually translating subtitles for my client's videos. Now I just upload, translate, and download. The AI quality is impressive.",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    role: "Content Creator",
    content: "As a YouTuber expanding to international markets, this is a game-changer. I can now offer subtitles in multiple languages without breaking the bank on translation services.",
    rating: 5,
  },
  {
    name: "Chen Wei",
    role: "Translation Agency Owner",
    content: "We use this for first-pass translations before human review. It's incredibly fast and accurate, cutting our turnaround time in half while maintaining quality.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-[var(--gradient-subtle)]">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by <span className="gradient-text">Creators Worldwide</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See what people are saying about our subtitle translation tool.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="p-8 hover:shadow-lg transition-shadow">
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/80 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="border-t pt-4">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
