import { useState, useEffect, useRef, useCallback } from "react";
import { Info, X } from "lucide-react";

const TOTAL_DURATION_MS = 10000; // 10 seconds
const INITIAL_DELAY_MS = 1000;

const AdBlockTip = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingMs, setRemainingMs] = useState(TOTAL_DURATION_MS);

  const remainingRef = useRef(TOTAL_DURATION_MS);
  const isPausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  remainingRef.current = remainingMs;
  isPausedRef.current = isPaused;

  const handleDismiss = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 200);
  }, []);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("adBlockTipSeen");
    if (hasSeen) return;

    const initialTimer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem("adBlockTipSeen", "true");

      const tickInterval = 100;
      intervalRef.current = setInterval(() => {
        if (isPausedRef.current) return;

        setRemainingMs((prev) => {
          const next = prev - tickInterval;
          if (next <= 0) {
            handleDismiss();
            return 0;
          }
          return next;
        });
      }, tickInterval);
    }, INITIAL_DELAY_MS);

    return () => {
      clearTimeout(initialTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [handleDismiss]);

  if (!isVisible) return null;

  const progressPercent = Math.max(0, Math.min(100, (remainingMs / TOTAL_DURATION_MS) * 100));

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`fixed z-50 pointer-events-auto transition-all duration-200 ease-out
        bottom-20 inset-x-3 max-w-sm mx-auto
        sm:bottom-6 sm:right-6 sm:left-auto sm:mx-0 sm:w-96
        ${isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}
      `}
    >
      <div className="relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl text-zinc-200 p-3.5">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-zinc-400 shrink-0 mt-0.5" />

          <div className="flex-1 min-w-0 pr-1 text-xs leading-relaxed">
            <span className="font-semibold text-white block mb-0.5">
              Ad Blocker Recommended
            </span>
            <p className="text-zinc-400">
              To prevent popups and redirects, consider using an ad blocker (like uBlock Origin) or an ad-blocking browser (like Brave or Opera).
            </p>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Close"
            className="shrink-0 p-1 -mr-1 -mt-1 text-zinc-500 hover:text-white rounded transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Minimal progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-800">
          <div
            className="h-full bg-zinc-500 transition-all duration-100 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdBlockTip;
