import { useState, useEffect } from "react";
import { MapPin, Phone, Clock, ExternalLink, Navigation } from "lucide-react";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { supabase } from "@/integrations/supabase/client";

interface VetClinic {
  name: string;
  address: string;
  phone: string;
  rating: number;
  open24h: boolean;
  website?: string;
}

interface VetMapWidgetProps {
  foodName: string;
  petType: "dog" | "cat";
}

export function VetMapWidget({ foodName, petType }: VetMapWidgetProps) {
  const { city, countryCode, lat, lon, isLoading: geoLoading } = useGeoLocation();
  const [clinics, setClinics] = useState<VetClinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVets = async () => {
      if (geoLoading) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-emergency-vets', {
          body: { city, countryCode, lat, lon }
        });

        if (error) throw error;
        setClinics(data?.clinics || []);
      } catch (err) {
        console.error('Error fetching vets:', err);
        setError('Could not load nearby clinics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVets();
  }, [city, countryCode, lat, lon, geoLoading]);

  const openGoogleMaps = () => {
    const query = encodeURIComponent(`emergency veterinary clinic near ${city || 'me'}`);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  const getDirections = (address: string) => {
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
  };

  if (isLoading || geoLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-danger" />
            </div>
            <div className="flex-1">
              <div className="h-5 w-48 bg-muted rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse mt-1" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 animate-slide-up">
      <div className="bg-card border border-danger/20 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-danger/5 px-5 py-4 border-b border-danger/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-danger/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-danger" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">
                  Emergency Vets Near You
                </h3>
                {city && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    Showing clinics near {city}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={openGoogleMaps}
              className="px-3 py-1.5 text-xs font-medium text-danger hover:text-danger/80 border border-danger/30 rounded-lg hover:bg-danger/5 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Map
            </button>
          </div>
        </div>

        {/* Clinic List */}
        <div className="p-4 space-y-3">
          {clinics.length > 0 ? (
            clinics.slice(0, 3).map((clinic, index) => (
              <div
                key={index}
                className="p-4 bg-background rounded-xl border border-border hover:border-danger/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground text-sm">
                        {clinic.name}
                      </h4>
                      {clinic.open24h && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-safe/10 text-safe text-xs font-medium rounded-full">
                          <Clock className="w-3 h-3" />
                          24/7
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {clinic.address}
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${clinic.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-danger text-white rounded-lg text-xs font-semibold hover:bg-danger/90 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call Now
                      </a>
                      <button
                        onClick={() => getDirections(clinic.address)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Directions
                      </button>
                    </div>
                  </div>
                  {clinic.rating && (
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-foreground">
                        {clinic.rating.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">★ rating</div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">
                No clinics found for your area
              </p>
              <button
                onClick={openGoogleMaps}
                className="inline-flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-xl text-sm font-semibold hover:bg-danger/90 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Find Emergency Vets on Google Maps
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-muted/30 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            ⚠️ If your {petType} ate {foodName}, time is critical. Call a clinic immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
