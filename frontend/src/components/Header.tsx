import { Button } from "@/components/ui/button";
import { Globe, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const toolLinks = [
  { to: "/text-translate", label: "Text Translator" },
  { to: "/subtitle-translate", label: "Subtitle Translator" },
  { to: "/detect-language", label: "Language Detector" },
  { to: "/compare-translations", label: "Compare Translations" },
  { to: "/transliterate", label: "Transliterate" },
  { to: "/subtitle-converter", label: "SRT ↔ VTT Converter" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass shadow-sm">
      <div className="section-container">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-xl hover:opacity-80 transition-opacity">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">TranslationForFree</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-all hover:scale-105 outline-none">
                Tools
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {toolLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to} className="w-full cursor-pointer">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a
              href="#features"
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all hover:scale-105"
            >
              Features
            </a>
            <a
              href="#faq"
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all hover:scale-105"
            >
              FAQ
            </a>
            <Link to="/text-translate">
              <Button variant="premium" size="default">Start Translating</Button>
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {toolLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href="#features"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Features
                </a>
                <a
                  href="#faq"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  FAQ
                </a>
                <Link to="/text-translate" onClick={() => setIsOpen(false)}>
                  <Button className="mt-4">Start Translating</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
