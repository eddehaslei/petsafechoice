import { MapPin, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmergencyVetButtonProps {
  petType: "dog" | "cat";
}

export function EmergencyVetButton({ petType }: EmergencyVetButtonProps) {
  const { t } = useTranslation();

  const handleFindVet = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          window.open(
            `https://www.google.com/maps/search/emergency+vet+near+me/@${latitude},${longitude},14z`,
            "_blank"
          );
        },
        () => {
          window.open("https://www.google.com/maps/search/emergency+vet+near+me", "_blank");
        },
        { timeout: 5000 }
      );
    } else {
      window.open("https://www.google.com/maps/search/emergency+vet+near+me", "_blank");
    }
  };

  return (
    <button
      onClick={handleFindVet}
      className="w-full mt-4 py-4 px-6 rounded-2xl bg-danger text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-danger/90 transition-all duration-200 animate-pulse hover:animate-none shadow-lg shadow-danger/30 min-h-[56px]"
    >
      <AlertTriangle className="w-6 h-6" />
      🚨 {t('emergencyVet.findNearest')}
      <MapPin className="w-6 h-6" />
    </button>
  );
}
