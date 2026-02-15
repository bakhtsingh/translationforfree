import { Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="section-container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">TranslationForFree</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Free AI-powered translation tools for text and subtitle files. No signup required.
            </p>
          </div>

          {/* Tools */}
          <div className="space-y-4">
            <h4 className="font-semibold">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/text-translate" className="hover:text-primary transition-colors">Text Translator</Link></li>
              <li><Link to="/subtitle-translate" className="hover:text-primary transition-colors">Subtitle Translator</Link></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><span className="text-muted-foreground/50">API (Coming Soon)</span></li>
              <li><span className="text-muted-foreground/50">Blog (Coming Soon)</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="text-muted-foreground/50">Privacy Policy (Coming Soon)</span></li>
              <li><span className="text-muted-foreground/50">Terms of Service (Coming Soon)</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} TranslationForFree. All rights reserved.</p>
          <p className="mt-2">Powered by advanced AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
