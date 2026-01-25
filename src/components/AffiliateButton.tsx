import { ShoppingBag, ExternalLink } from "lucide-react";

interface AffiliateButtonProps {
  productName: string;
  affiliateUrl: string;
}

export function AffiliateButton({ productName, affiliateUrl }: AffiliateButtonProps) {
  const handleClick = () => {
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex justify-center w-full">
      <button
        onClick={handleClick}
        className="w-[90%] sm:w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5 rounded-2xl font-bold text-white text-base sm:text-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
        style={{ backgroundColor: '#F28C74' }}
      >
        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
        <span className="text-center leading-tight">Shop Best-Selling {productName} on Amazon</span>
        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
      </button>
    </div>
  );
}
