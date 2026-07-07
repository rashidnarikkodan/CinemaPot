import { useState, useEffect } from "react";
import BraveRecommendation from "./BraveRecommendation";

const GlobalBravePopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkAndShowPopup = async () => {
      // Check if the user is already using Brave browser
      let isBrave = false;
      const nav = navigator as Navigator & { brave?: { isBrave?: () => Promise<boolean> } };
      if (nav.brave && typeof nav.brave.isBrave === 'function') {
        try {
          isBrave = await nav.brave.isBrave();
        } catch (error) {
          console.error("Error checking Brave status:", error);
        }
      }

      // If they are on Brave, we don't need to recommend it
      if (isBrave) return;

      // Check if we've already shown the popup in this browser tab session
      const hasShownThisSession = sessionStorage.getItem("bravePopupShownSession");
      
      if (!hasShownThisSession) {
        const timer = setTimeout(() => {
          setIsVisible(true);
          sessionStorage.setItem("bravePopupShownSession", "true");
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    };

    checkAndShowPopup();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-500 sm:bottom-6 sm:right-6">
      <BraveRecommendation 
        showDismiss={true} 
        onDismiss={() => setIsVisible(false)} 
        className="shadow-2xl shadow-orange-900/20"
      />
    </div>
  );
};

export default GlobalBravePopup;
