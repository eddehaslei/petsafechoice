import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Dog, Cat, ArrowLeft, AlertTriangle, Siren, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AFFILIATE_TAG } from "@/lib/amazonAffiliateUrl";
import { cn } from "@/lib/utils";

export type SafetyStatus = "safe" | "dangerous" | "caution";

export interface FoodPageProps {
  foodName: string;
  emoji: string;
  dogStatus: SafetyStatus;
  catStatus: SafetyStatus;
  dogSummary: string;
  catSummary: string;
  dogDetails: string;
  catDetails: string;
  symptoms: string[];
  safeAlternatives: string[];
  amazonSearchTermDog: string;
  amazonSearchTermCat: string;
  metaTitle: string;
  metaDescription: string;
}

const statusConfig: Record<SafetyStatus, { label: string; className: string }> = {
  safe: { label: "Safe ✅", className: "bg-safe text-safe-foreground" },
  dangerous: { label: "Dangerous ❌", className: "bg-danger text-danger-foreground" },
  caution: { label: "Caution ⚠️", className: "bg-caution text-caution-foreground" },
};

export default function FoodPage(props: FoodPageProps) {
  const {
    foodName, emoji, dogStatus, catStatus,
    dogSummary, catSummary, dogDetails, catDetails,
    symptoms, safeAlternatives,
    amazonSearchTermDog, amazonSearchTermCat,
    metaTitle, metaDescription,
  } = props;

  const showSymptoms = dogStatus !== "safe" || catStatus !== "safe";
  const showEmergency = dogStatus === "dangerous" || catStatus === "dangerous";
  const foodSlug = foodName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="PetSafeChoice" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <link rel="canonical" href={`https://petsafechoice.lovable.app/foods/${foodSlug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: metaTitle,
          description: metaDescription,
          author: { "@type": "Organization", name: "PetSafeChoice" },
          publisher: { "@type": "Organization", name: "PetSafeChoice" },
        })}</script>
      </Helmet>

      <Header />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link to="/foods" className="hover:text-foreground transition-colors">Food Safety</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">{foodName}</li>
          </ol>
        </nav>

        {/* Back to Search */}
        <Button variant="outline" size="sm" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Search
          </Link>
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">
            {emoji} {foodName}
          </h1>
          <div className="flex justify-center gap-3 mb-3 flex-wrap">
            <Badge className={cn("text-sm px-3 py-1", statusConfig[dogStatus].className)}>
              🐶 Dogs: {statusConfig[dogStatus].label}
            </Badge>
            <Badge className={cn("text-sm px-3 py-1", statusConfig[catStatus].className)}>
              🐱 Cats: {statusConfig[catStatus].label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Science-backed · Vet reviewed</p>
        </div>

        {/* Dog & Cat Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Dog Section */}
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Dog className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-heading font-bold">For Dogs</h2>
                <Badge className={cn("ml-auto", statusConfig[dogStatus].className)}>
                  {statusConfig[dogStatus].label}
                </Badge>
              </div>
              <p className="font-semibold text-foreground mb-2">{dogSummary}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{dogDetails}</p>
            </CardContent>
          </Card>

          {/* Cat Section */}
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Cat className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-heading font-bold">For Cats</h2>
                <Badge className={cn("ml-auto", statusConfig[catStatus].className)}>
                  {statusConfig[catStatus].label}
                </Badge>
              </div>
              <p className="font-semibold text-foreground mb-2">{catSummary}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{catDetails}</p>
            </CardContent>
          </Card>
        </div>

        {/* Symptoms */}
        {showSymptoms && symptoms.length > 0 && (
          <Card className={cn(
            "mb-8 border-2",
            showEmergency ? "border-danger/40 bg-danger-bg" : "border-caution/40 bg-caution-bg"
          )}>
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className={cn("w-5 h-5", showEmergency ? "text-danger" : "text-caution")} />
                Warning Signs to Watch For
              </h2>
              <ul className="space-y-1.5">
                {symptoms.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-1">•</span>{s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Emergency */}
        {showEmergency && (
          <Card className="mb-8 border-2 border-danger bg-danger/5">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-heading font-bold mb-2 flex items-center justify-center gap-2">
                <Siren className="w-5 h-5 text-danger" />
                If your pet ate this
              </h2>
              <p className="text-muted-foreground mb-4">
                Act immediately. Call your vet or find an emergency clinic near you.
              </p>
              <Button variant="destructive" size="lg" asChild>
                <Link to="/emergency">Find Emergency Vet Near Me</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Safe Alternatives */}
        <Card className="mb-8 border-safe/30 bg-safe-bg">
          <CardContent className="p-6">
            <h2 className="text-xl font-heading font-bold mb-4">✅ Safe Alternatives Your Pet Will Love</h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {safeAlternatives.map((alt) => (
                <Badge key={alt} variant="secondary" className="text-sm px-3 py-1">
                  {alt}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-primary hover:bg-primary/90 flex-1">
                <a
                  href={`https://www.amazon.com/s?k=${amazonSearchTermDog}&tag=${AFFILIATE_TAG}`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  Shop Safe Dog Treats on Amazon 🐶
                </a>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 flex-1">
                <a
                  href={`https://www.amazon.com/s?k=${amazonSearchTermCat}&tag=${AFFILIATE_TAG}`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  Shop Safe Cat Treats on Amazon 🐱
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer CTA */}
        <div className="text-center py-8">
          <Button size="lg" asChild>
            <Link to="/">
              <Search className="w-4 h-4 mr-2" />
              🔍 Check another food
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">Always consult your vet for medical advice.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
