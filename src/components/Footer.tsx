import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-8 border-t border-border/50 bg-card/30">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <h4 className="font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/safe-foods" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Safe Foods List
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Emergency Contacts
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            Made with <Heart className="w-4 h-4 inline text-primary" /> for pet parents everywhere
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            © {new Date().getFullYear()} Can My Pet Eat This? All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
