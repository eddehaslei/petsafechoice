import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function NewsletterSignup() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error(t('newsletter.invalidEmail', 'Please enter a valid email address'));
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - in production, this would save to Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubscribed(true);
    toast.success(t('newsletter.success', 'Thanks for subscribing! Check your inbox for our welcome email.'));
    setEmail("");
  };

  if (isSubscribed) {
    return (
      <div className="bg-safe/5 border border-safe/20 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-safe/20 flex items-center justify-center shrink-0">
          <Check className="w-5 h-5 text-safe" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {t('newsletter.subscribed', "You're subscribed!")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('newsletter.checkInbox', 'Check your inbox for weekly safety tips.')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-4 h-4 text-primary" />
        <h4 className="font-semibold text-sm text-foreground">
          {t('newsletter.title', 'Weekly Safety Tips')}
        </h4>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        {t('newsletter.description', 'Get pet food safety tips, recalls, and expert advice in your inbox.')}
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletter.placeholder', 'Enter your email')}
          className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[44px]"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px]"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t('newsletter.subscribe', 'Subscribe')
          )}
        </button>
      </form>
    </div>
  );
}
