import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Phone, MapPin, Clock, Star, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface VetClinic {
  name: string;
  address: string;
  phone: string;
  rating: number;
  open24h: boolean;
  website?: string;
}

interface EmergencyData {
  city: string;
  countryCode: string;
  clinics: VetClinic[];
  emergencyNumbers: {
    poison: string;
    general: string;
  };
  message: string;
}

const Emergency = () => {
  const { t } = useTranslation();
  const { city, countryCode, isLoading: geoLoading, error: geoError } = useGeoLocation();
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmergencyVets = async () => {
      if (geoLoading) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-emergency-vets', {
          body: { city, countryCode }
        });

        if (error) throw error;
        setEmergencyData(data);
      } catch (err) {
        console.error('Error fetching emergency vets:', err);
        setError('Failed to load emergency vet information');
        // Set default data
        setEmergencyData({
          city: city || 'Unknown',
          countryCode: countryCode || 'US',
          clinics: [],
          emergencyNumbers: {
            poison: 'ASPCA: (888) 426-4435',
            general: '911'
          },
          message: 'Could not load location-specific data. Showing default emergency information.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmergencyVets();
  }, [city, countryCode, geoLoading]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen hero-gradient relative flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">
            {t('emergency.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('emergency.subtitle')}
          </p>
          {city && !geoLoading && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Showing results for: {city}</span>
            </div>
          )}
        </div>

        {/* Emergency Alert */}
        <div className="bg-danger/10 border border-danger/30 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-danger/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-danger" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">If Your Pet Is In Immediate Danger</h2>
              <p className="text-muted-foreground mb-4">
                Call your nearest emergency vet clinic immediately. Time is critical in poisoning cases.
              </p>
              {emergencyData && (
                <div className="flex flex-wrap gap-3">
                  <Button variant="destructive" className="gap-2" asChild>
                    <a href={`tel:${emergencyData.emergencyNumbers.general.replace(/\D/g, '')}`}>
                      <Phone className="w-4 h-4" />
                      Emergency: {emergencyData.emergencyNumbers.general}
                    </a>
                  </Button>
                  <Button variant="outline" className="gap-2 border-danger/50 text-danger hover:bg-danger/10" asChild>
                    <a href={`tel:${emergencyData.emergencyNumbers.poison.replace(/[^\d+]/g, '')}`}>
                      <Phone className="w-4 h-4" />
                      {emergencyData.emergencyNumbers.poison}
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {(isLoading || geoLoading) && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <p className="text-muted-foreground font-medium">
              Finding emergency vets near you...
            </p>
          </div>
        )}

        {/* Error State */}
        {geoError && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8 text-center">
            <p className="text-muted-foreground">
              Could not detect your location. Showing general emergency information.
            </p>
          </div>
        )}

        {/* Emergency Vet Clinics */}
        {!isLoading && !geoLoading && emergencyData && (
          <>
            {emergencyData.clinics.length > 0 ? (
              <div className="bg-card rounded-2xl border border-border p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">24/7 Emergency Vet Clinics</h2>
                    <p className="text-sm text-muted-foreground">
                      {emergencyData.message}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {emergencyData.clinics.map((clinic, index) => (
                    <div 
                      key={index}
                      className="bg-background rounded-xl border border-border/50 p-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{clinic.name}</h3>
                            {renderStars(clinic.rating)}
                            {clinic.open24h && (
                              <span className="px-2 py-0.5 bg-safe/10 text-safe text-xs font-medium rounded-full">
                                24/7
                              </span>
                            )}
                          </div>
                          <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{clinic.address}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <a 
                              href={`tel:${clinic.phone.replace(/\D/g, '')}`}
                              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                            >
                              <Phone className="w-4 h-4" />
                              {clinic.phone}
                            </a>
                            {clinic.website && (
                              <a 
                                href={clinic.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Website
                              </a>
                            )}
                          </div>
                        </div>
                        <Button variant="default" size="sm" className="flex-shrink-0" asChild>
                          <a href={`tel:${clinic.phone.replace(/\D/g, '')}`}>
                            Call Now
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border p-6 mb-8 text-center">
                <p className="text-muted-foreground mb-4">
                  No specific emergency vet clinics found for your location. 
                  Please search online for "24 hour emergency vet near me" or call the emergency numbers above.
                </p>
                <Button variant="outline" asChild>
                  <a 
                    href={`https://www.google.com/maps/search/24+hour+emergency+vet+${encodeURIComponent(city || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Search on Google Maps
                  </a>
                </Button>
              </div>
            )}
          </>
        )}

        {/* What To Do Section */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">What To Do In A Pet Emergency</h2>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">1</span>
              <p className="text-muted-foreground"><strong className="text-foreground">Stay calm.</strong> Your pet can sense your stress.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">2</span>
              <p className="text-muted-foreground"><strong className="text-foreground">Note what they ate</strong> and approximately how much.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">3</span>
              <p className="text-muted-foreground"><strong className="text-foreground">Call the emergency vet</strong> before heading there - they may give you immediate instructions.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">4</span>
              <p className="text-muted-foreground"><strong className="text-foreground">Don't induce vomiting</strong> unless specifically instructed by a vet.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">5</span>
              <p className="text-muted-foreground"><strong className="text-foreground">Bring the packaging</strong> or sample of what your pet consumed if possible.</p>
            </li>
          </ol>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Emergency;
