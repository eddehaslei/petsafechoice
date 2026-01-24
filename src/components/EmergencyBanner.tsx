import { useState, useEffect } from "react";
import { AlertTriangle, Phone, ExternalLink, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGeoLocation } from "@/hooks/useGeoLocation";

interface EmergencyBannerProps {
  foodName: string;
  petType: "dog" | "cat";
}

// Country-specific poison control information
const poisonControlByCountry: Record<string, {
  name: string;
  phone: string;
  phoneFormatted: string;
  website?: string;
  note?: string;
}> = {
  ES: {
    name: "Instituto Nacional de Toxicología",
    phone: "+34915620420",
    phoneFormatted: "915 62 04 20",
    note: "Servicio 24h en España",
  },
  FR: {
    name: "Centre Antipoison",
    phone: "+33140054848",
    phoneFormatted: "01 40 05 48 48",
    note: "Disponible 24h/24 en France",
  },
  DE: {
    name: "Giftnotruf Berlin",
    phone: "+493019240",
    phoneFormatted: "030 192 40",
    note: "24 Stunden erreichbar",
  },
  GB: {
    name: "Animal PoisonLine",
    phone: "+441onal2509000",
    phoneFormatted: "01onal2 509 000",
    website: "https://www.animalpoisonline.co.uk",
    note: "UK 24/7 service, fees may apply",
  },
  US: {
    name: "ASPCA Animal Poison Control",
    phone: "+18884264435",
    phoneFormatted: "(888) 426-4435",
    website: "https://www.aspca.org/pet-care/animal-poison-control",
    note: "US - available 24/7, fees may apply",
  },
  AE: {
    name: "Dubai Municipality",
    phone: "+971800900",
    phoneFormatted: "800 900",
    note: "UAE Emergency Line",
  },
  AU: {
    name: "Animal Poisons Helpline",
    phone: "+611300869738",
    phoneFormatted: "1300 869 738",
    note: "Australia 24/7",
  },
  CA: {
    name: "Pet Poison Helpline",
    phone: "+18557647661",
    phoneFormatted: "(855) 764-7661",
    note: "Canada 24/7, fees may apply",
  },
};

// Default to US if country not found
const defaultPoisonControl = poisonControlByCountry.US;

export function EmergencyBanner({ foodName, petType }: EmergencyBannerProps) {
  const { t } = useTranslation();
  const { countryCode, city, isLoading } = useGeoLocation();
  
  // Get country-specific poison control info
  const poisonControl = countryCode && poisonControlByCountry[countryCode] 
    ? poisonControlByCountry[countryCode] 
    : defaultPoisonControl;

  // Get the appropriate website link
  const websiteUrl = poisonControl.website || "https://www.aspca.org/pet-care/animal-poison-control";
  
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 animate-slide-up">
      <div className="bg-danger/10 border-2 border-danger/30 rounded-2xl p-5 relative overflow-hidden">
        {/* Urgent pulse effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-danger/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
        
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-danger/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-danger" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                Did Your {petType === "dog" ? "Dog" : "Cat"} Eat {foodName}?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Time is critical in poisoning cases. Contact a veterinarian immediately if you suspect your pet has ingested this food.
              </p>
              
              {/* Location indicator */}
              {city && !isLoading && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Showing emergency info for {city}</span>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/emergency"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-danger hover:bg-danger/90 text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-danger/25"
                >
                  <Phone className="w-4 h-4" />
                  Emergency Contacts
                </Link>
                
                <a
                  href={`tel:${poisonControl.phone}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-card hover:bg-accent border border-danger/30 rounded-xl font-semibold text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Phone className="w-4 h-4" />
                  Call {poisonControl.phoneFormatted}
                </a>
              </div>
            </div>
          </div>
          
          {/* Emergency hotline callout - now geo-aware */}
          <div className="mt-4 pt-4 border-t border-danger/20">
            <p className="text-xs text-muted-foreground text-center">
              <strong>{poisonControl.name}:</strong>{" "}
              <a href={`tel:${poisonControl.phone}`} className="text-danger font-semibold hover:underline">
                {poisonControl.phoneFormatted}
              </a>{" "}
              {poisonControl.note && <span>({poisonControl.note})</span>}
            </p>
            {poisonControl.website && (
              <p className="text-xs text-muted-foreground text-center mt-1">
                <a 
                  href={poisonControl.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Visit Website
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
