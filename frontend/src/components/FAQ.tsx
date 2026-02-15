import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What can I translate with this tool?",
    answer: "You can translate plain text using our Text Translator, or upload SRT and VTT subtitle files using our Subtitle Translator. Both tools support 50+ languages and are completely free.",
  },
  {
    question: "Is this really free?",
    answer: "Yes! Both the text translator and subtitle translator are free to use right now. We're building premium features for power users and teams, but the core translation tools will always have a free tier.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No! You can start translating immediately — no email, no password, no signup required.",
  },
  {
    question: "How accurate are the translations?",
    answer: "We use advanced AI that understands context and nuance, providing professional-quality translations. For subtitles, the AI also maintains timing perfectly while translating the text accurately.",
  },
  {
    question: "How many languages do you support?",
    answer: "50+ languages including all major world languages: English, Spanish, French, German, Chinese, Japanese, Arabic, Hindi, Portuguese, Russian, Italian, Korean, and many more.",
  },
  {
    question: "Is there a character limit for text translation?",
    answer: "Our text translator supports up to 5,000 characters per translation. For longer content, simply break it into sections for the best results.",
  },
  {
    question: "What subtitle formats do you support?",
    answer: "We support both SRT and VTT formats — the two most common subtitle file types. Your translated file will be downloaded in the same format as the original, with all timing preserved.",
  },
  {
    question: "Can I edit translations before downloading?",
    answer: "Yes! For subtitles, you can review and edit any line in the browser before downloading. For text translations, you can copy the result and make any adjustments you need.",
  },
  {
    question: "Can I use this for YouTube videos?",
    answer: "Yes! Export your subtitles from YouTube (or any video platform), translate them with our Subtitle Translator, then upload the translated version back. Perfect for content creators going global.",
  },
  {
    question: "Is my data private?",
    answer: "We process your text for translation and do not store it after the translation is complete. Your content is never used for training or shared with third parties.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about our translation tools.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
