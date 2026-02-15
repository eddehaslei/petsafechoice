import { useState } from "react";
import { Share2, Twitter, Facebook, Link2, Check, MessageCircle } from "lucide-react";
import { SafetyResultData } from "./SafetyResult";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface SocialShareCardProps {
  data: SafetyResultData;
}

export function SocialShareCard({ data }: SocialShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const petName = data.petType === "dog" ? t('petToggle.dog') + "s" : t('petToggle.cat') + "s";
  const foodName = data.food.charAt(0).toUpperCase() + data.food.slice(1);
  
  const getSafetyEmoji = () => {
    switch (data.safetyLevel) {
      case "safe": return "✅";
      case "caution": return "⚠️";
      case "dangerous": return "🚫";
    }
  };

  const getSafetyText = () => {
    switch (data.safetyLevel) {
      case "safe": return t('share.safe');
      case "caution": return t('share.caution');
      case "dangerous": return t('share.dangerous');
    }
  };

  const shareText = `${getSafetyEmoji()} ${t('share.isSafetyFor', { food: foodName, safety: getSafetyText(), petName })}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const siteName = "PetSafeChoice";

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      toast.success(t('share.copied'));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(t('share.copyFailed'));
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <div className="flex justify-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-card hover:bg-accent border border-border rounded-xl text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5"
        >
          <Share2 className="w-4 h-4" />
          {t('share.button')}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 animate-slide-up">
          <div className="bg-card border border-border rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                data.safetyLevel === "safe" ? "bg-safe/20" :
                data.safetyLevel === "caution" ? "bg-caution/20" : "bg-danger/20"
              }`}>
                {getSafetyEmoji()}
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {t('share.isSafetyFor', { food: foodName, safety: getSafetyText(), petName })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('share.checkedOn', { site: siteName })}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {data.summary}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => handleShare("twitter")} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-xl font-medium text-sm transition-all duration-200 hover:-translate-y-0.5">
              <Twitter className="w-4 h-4" />Twitter
            </button>
            <button onClick={() => handleShare("facebook")} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl font-medium text-sm transition-all duration-200 hover:-translate-y-0.5">
              <Facebook className="w-4 h-4" />Facebook
            </button>
            <button onClick={() => handleShare("whatsapp")} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-medium text-sm transition-all duration-200 hover:-translate-y-0.5">
              <MessageCircle className="w-4 h-4" />WhatsApp
            </button>
            <button onClick={copyToClipboard} className="inline-flex items-center gap-2 px-4 py-2.5 bg-muted hover:bg-accent text-foreground rounded-xl font-medium text-sm transition-all duration-200 hover:-translate-y-0.5">
              {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
              {copied ? t('share.copied_short') : t('share.copyLink')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
