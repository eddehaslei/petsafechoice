import { Info, ShieldCheck, Phone, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10">
      <div className="container max-w-4xl mx-auto px-4 py-4 flex justify-end">
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5" asChild>
            <Link to="/about">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5" asChild>
            <Link to="/safe-foods">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Safe Foods</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5" asChild>
            <Link to="/emergency">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Emergency</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5" asChild>
            <Link to="/faq">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">FAQ</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};
