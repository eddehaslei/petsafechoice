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
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
      style={{ backgroundColor: '#F28C74' }}
    >
      <ShoppingBag className="w-6 h-6" />
      <span>View Recommended {productName} on Amazon</span>
      <ExternalLink className="w-5 h-5" />
    </button>
  );
}
