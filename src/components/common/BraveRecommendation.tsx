import { useState } from "react";
import { X, ExternalLink } from "lucide-react";

interface BraveRecommendationProps {
  className?: string;
  onDismiss?: () => void;
  showDismiss?: boolean;
}

const getInitialStoreLink = () => {
  if (typeof window === "undefined") return "https://brave.com/download/";
  const win = window as Window & { opera?: string; MSStream?: unknown };
  const userAgent = navigator.userAgent || navigator.vendor || win.opera || "";
  if (/android/i.test(userAgent)) {
    return "https://play.google.com/store/apps/details?id=com.brave.browser";
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !win.MSStream) {
    return "https://apps.apple.com/us/app/brave-private-web-browser/id1052879175";
  }
  return "https://brave.com/download/";
};

const BraveRecommendation = ({ className = "", onDismiss, showDismiss = false }: BraveRecommendationProps) => {
  const [storeLink] = useState(getInitialStoreLink);

  return (
    <div className={`flex max-w-[360px] w-max flex-col gap-4 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-zinc-900/95 to-black/98 p-5 shadow-[0_8px_32px_-4px_rgba(251,84,43,0.15)] backdrop-blur-xl group relative ${className}`}>
      
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/0 via-orange-500/10 to-purple-600/0 rounded-2xl blur-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-900 p-2.5 shadow-inner border border-zinc-700/50">
            <img 
              src="https://brave.com/static-assets/images/brave-logo-sans-text.svg" 
              alt="Brave Browser" 
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <div className="space-y-1 mt-0.5">
            <h3 className="text-base font-black text-white tracking-wide uppercase italic">
              Use <span className="text-orange-500">Brave</span>
            </h3>
            <p className="text-[13px] text-zinc-400 leading-snug">
              Block annoying ads and prevent popups for a flawless streaming experience.
            </p>
          </div>
        </div>
        {showDismiss && onDismiss && (
          <button
            onClick={onDismiss}
            className="relative -mr-2 -mt-2 shrink-0 rounded-full p-2 text-zinc-500 hover:bg-white/5 hover:text-white transition-colors"
            aria-label="Dismiss recommendation"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      <div className="relative flex gap-3 mt-1">
        <a
          href={storeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 text-white px-4 py-3 text-sm font-bold shadow-md shadow-orange-600/20 transition-all hover:bg-orange-500 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Get Brave Browser</span>
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default BraveRecommendation;
