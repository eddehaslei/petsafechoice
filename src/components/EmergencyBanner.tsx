import { AlertTriangle, Phone, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface EmergencyBannerProps {
  foodName: string;
  petType: "dog" | "cat";
}

export function EmergencyBanner({ foodName, petType }: EmergencyBannerProps) {
  const { t } = useTranslation();
  
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
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/emergency"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-danger hover:bg-danger/90 text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-danger/25"
                >
                  <Phone className="w-4 h-4" />
                  Emergency Contacts
                </Link>
                
                <a
                  href="https://www.aspca.org/pet-care/animal-poison-control"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-card hover:bg-accent border border-danger/30 rounded-xl font-semibold text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  ASPCA Poison Control
                </a>
              </div>
            </div>
          </div>
          
          {/* Emergency hotline callout */}
          <div className="mt-4 pt-4 border-t border-danger/20">
            <p className="text-xs text-muted-foreground text-center">
              <strong>ASPCA Animal Poison Control:</strong>{" "}
              <a href="tel:+18884264435" className="text-danger font-semibold hover:underline">
                (888) 426-4435
              </a>{" "}
              (US - available 24/7, fees may apply)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
